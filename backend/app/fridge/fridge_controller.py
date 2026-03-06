import json
import os
from datetime import datetime

import httpx
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.database import db
from app.fridge.fridge_upload_service import upload_fridge_scan_to_s3
from app.legal.legal_middleware import verify_legal_consent
from app.user.authorization.auth_middleware import get_current_user

router = APIRouter(prefix="/fridge", tags=["Fridge Scanning"])

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL")
if not AI_SERVICE_URL:
    raise RuntimeError("AI_SERVICE_URL is not set in environment variables")


@router.post("/scan")
async def scan_fridge(file: UploadFile = File(...), user_id: str = Depends(verify_legal_consent)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="The file must be an image")

    file_bytes = await file.read()
    predict_url = f"{AI_SERVICE_URL}/predict"

    async with httpx.AsyncClient() as client:
        try:
            files = {"file": (file.filename, file_bytes, file.content_type)}
            response = await client.post(predict_url, files=files, timeout=60.0)
            response.raise_for_status()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"AI Service is unavailable: {str(e)}")
        except httpx.HTTPStatusError:
            raise HTTPException(
                status_code=response.status_code, detail=f"AI Service error: {response.text}"
            )

    data = response.json()
    ingredients = data.get("ingredients", [])

    if ingredients:
        ai_labels = [item.get("ingredient") for item in ingredients if item.get("ingredient")]

        cursor = db.products.find({"ai_label": {"$in": ai_labels}})
        matching_products = await cursor.to_list(length=None)

        label_to_info = {
            p.get("ai_label"): {
                "name": p.get("name"),
                # Беремо default_unit з БД. Якщо його там ще немає,
                # ставимо 'pcs' (бо камера зазвичай бачить штучні об'єкти: яблука, буряк тощо)
                "unit": p.get("default_unit", "pcs"),
            }
            for p in matching_products
            if p.get("ai_label")
        }

        for item in ingredients:
            original_label = item["ingredient"]
            item["ai_label"] = original_label

            if original_label in label_to_info:
                item["ingredient"] = label_to_info[original_label]["name"]
                item["unit"] = label_to_info[original_label]["unit"]
            else:
                item["ingredient"] = original_label.replace("_", " ").capitalize()
                item["unit"] = "pcs"

    return data


@router.post("/generate", summary="Save to R2, save feedback, and recommend recipes from DB")
async def generate_recipes(
    file: UploadFile = File(...),
    original_items: str = Form(..., description="JSON array of original AI items"),
    final_items: str = Form(..., description="JSON array of final user items with quantities"),
    user_id: str = Depends(get_current_user),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="The file must be an image")

    file_bytes = await file.read()
    scan_id = await upload_fridge_scan_to_s3(file_bytes)

    try:
        original_list = json.loads(original_items)
        final_list = json.loads(final_items)  # Тепер це масив об'єктів!
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for items")

    correction_doc = {
        "scan_id": scan_id,
        "original_ai_items": original_list,
        "final_user_items": final_list,
        "created_at": datetime.utcnow(),
    }
    await db.ai_corrections.insert_one(correction_doc)

    # 3. ШУКАЄМО РЕЦЕПТИ З УРАХУВАННЯМ ПЕРЕДАНИХ КОРИСТУВАЧЕМ ЗНАЧЕНЬ
    user_inventory_by_name = {}
    for item in final_list:
        # Безпечно витягуємо дані (раптом прийде старий формат)
        if isinstance(item, str):
            name, qty, unit = item, 1.0, "pcs"
        else:
            name = item.get("name", "")
            qty = float(item.get("quantity", 1.0))
            unit = item.get("unit", "pcs").lower()

        if name in user_inventory_by_name:
            user_inventory_by_name[name]["quantity"] += qty
        else:
            user_inventory_by_name[name] = {"quantity": qty, "unit": unit}

    ingredient_names = list(user_inventory_by_name.keys())
    recommended_recipes = []

    if ingredient_names:
        cursor = db.products.find({"name": {"$in": ingredient_names}})
        products = await cursor.to_list(length=None)

        # Словник { "ID_продукту": {"quantity": 400, "unit": "g"} }
        user_inventory_by_id = {str(p["_id"]): user_inventory_by_name[p["name"]] for p in products}

        if user_inventory_by_id:
            recipes_cursor = db.recipes.find(
                {"ingredients._id": {"$in": list(user_inventory_by_id.keys())}}
            )
            recipes = await recipes_cursor.to_list(length=None)

            for recipe in recipes:
                recipe_ingredients = recipe.get("ingredients", [])
                if not recipe_ingredients:
                    continue

                match_score = 0.0
                matched_count = 0

                for req_item in recipe_ingredients:
                    req_id = req_item.get("_id")
                    req_qty = req_item.get("quantity", 1)

                    user_item = user_inventory_by_id.get(req_id)

                    if user_item and user_item["quantity"] > 0:
                        matched_count += 1
                        user_qty = user_item["quantity"]

                        # Ділимо те що є, на те, що потрібно.
                        # Якщо рецепт хоче 400г цукру, а юзер вказав 100г, score буде 0.25
                        item_score = min(1.0, user_qty / req_qty) if req_qty > 0 else 1.0
                        match_score += item_score

                total_count = len(recipe_ingredients)
                match_percentage = match_score / total_count if total_count > 0 else 0

                recipe["_id"] = str(recipe["_id"])
                recipe["match_percentage"] = match_percentage
                recipe["matched_ingredients_count"] = matched_count

                recommended_recipes.append(recipe)

            recommended_recipes.sort(
                key=lambda x: (x["match_percentage"], x["matched_ingredients_count"]), reverse=True
            )

    return {
        "status": "success",
        "scan_id": scan_id,
        "message": "Recipes found successfully!",
        "ingredients_used": final_list,
        "recipes": recommended_recipes,
    }
