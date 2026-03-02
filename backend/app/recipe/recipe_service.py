from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import HTTPException

from app.database import db
from app.recipe.recipe_schemas import RecipeUpdateSchemaOptional  # , RecipeCreateSchema


# -------------------- Допоміжна функція для "плоского" словника --------------------
# Перетворює вкладений словник на плоский для MongoDB ($set)
def flatten_dict(d, prefix=""):
    items = []
    for k, v in d.items():
        new_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key).items())
        else:
            items.append((new_key, v))
    return dict(items)


# -------------------- Створення рецепту --------------------
# async def create_recipe(data: RecipeCreateSchema):
#     # Перетворюємо Pydantic модель у словник
#     recipe_dict = data.model_dump()
#
#     # Додаємо дату створення та оновлення
#     recipe_dict["created_at"] = datetime.utcnow()
#     recipe_dict["updated_at"] = datetime.utcnow()
#
#     # Перетворюємо _id інгредієнтів у ObjectId для MongoDB
#     for ing in recipe_dict.get("ingredients", []):
#         if "_id" in ing:
#             try:
#                 ing["_id"] = ObjectId(ing["_id"])
#             except:
#                 # Якщо _id не валідний ObjectId, залишаємо як string
#                 pass
#
#     # Вставляємо рецепт у MongoDB
#     result = await db.recipes.insert_one(recipe_dict)
#
#     # Додаємо _id документа рецепту у словник для повернення
#     recipe_dict["_id"] = str(result.inserted_id)
#
#     # Перетворюємо _id інгредієнтів назад у string для відповіді API
#     for ing in recipe_dict.get("ingredients", []):
#         if "_id" in ing and isinstance(ing["_id"], ObjectId):
#             ing["_id"] = str(ing["_id"])
#
#     return recipe_dict


# -------------------- Повне оновлення рецепту --------------------
async def update_recipe(recipe_id: str, raw_data: dict):
    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    result = await db.recipes.update_one(
        {"_id": ObjectId(recipe_id)},
        {"$set": update_query},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }


# -------------------- Часткове оновлення рецепту --------------------
async def update_recipe_optional(recipe_id: str, data: RecipeUpdateSchemaOptional):
    raw_data = data.model_dump(exclude_unset=True)
    if not raw_data:
        return {"status": "success", "updated_fields": [], "matched_count": 0}

    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    result = await db.recipes.update_one(
        {"_id": ObjectId(recipe_id)},
        {"$set": update_query},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }


# -------------------- Отримати рецепт за ID --------------------
async def get_recipe(recipe_id: str):
    try:
        obj_id = ObjectId(recipe_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid recipe ID")

    recipe = await db.recipes.find_one({"_id": obj_id}, {"_id": 0})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return recipe


# -------------------- Пошук рецептів за назвою продукту --------------------
async def search_recipes_by_name(name: str) -> List[dict]:
    # Використовуємо регекс для пошуку продукту в інгредієнтах
    cursor = db.recipes.find(
        {"ingredients": {"$elemMatch": {"name": {"$regex": name, "$options": "i"}}}},
        {"_id": 1, "name": 1, "goal": 1, "cooking_time": 1, "difficulty": 1},
    )
    results = await cursor.to_list(length=50)  # максимум 50 результатів
    return {"recipes": results}
