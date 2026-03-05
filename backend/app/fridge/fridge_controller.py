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

        label_to_name = {
            p.get("ai_label"): p.get("name") for p in matching_products if p.get("ai_label")
        }

        for item in ingredients:
            original_label = item["ingredient"]

            item["ai_label"] = original_label

            if original_label in label_to_name:
                item["ingredient"] = label_to_name[original_label]
            else:
                item["ingredient"] = original_label.replace("_", " ").capitalize()

    return data


@router.post("/generate", summary="Save to R2, save feedback, and generate recipes")
async def generate_recipes(
    file: UploadFile = File(...),
    original_items: str = Form(..., description="JSON array of original AI items"),
    final_items: str = Form(..., description="JSON array of final user items"),
    user_id: str = Depends(get_current_user),
    # Залишаємо Depends для захисту роуту (щоб генерували тільки авторизовані)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="The file must be an image")

    file_bytes = await file.read()

    # 1. Завантажуємо фото в R2 АНОНІМНО (без user_id)
    scan_id = await upload_fridge_scan_to_s3(file_bytes)

    try:
        original_list = json.loads(original_items)
        final_list = json.loads(final_items)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for items")

    # 3. Зберігаємо АНОНІМНИЙ фідбек (без поля user_id)
    correction_doc = {
        "scan_id": scan_id,
        "original_ai_items": original_list,
        "final_user_items": final_list,
        "created_at": datetime.utcnow(),
    }
    await db.ai_corrections.insert_one(correction_doc)

    # 4. ТУТ БУДЕ ЛОГІКА ЗВЕРНЕННЯ ДО LLM
    # recipes = await llm_service.generate(final_list)

    return {
        "status": "success",
        "scan_id": scan_id,
        "message": "Data saved cleanly and anonymously. Ready to generate recipes!",
        "ingredients_used": final_list,
    }
