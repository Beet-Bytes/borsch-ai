from datetime import datetime

from bson import ObjectId
from fastapi import HTTPException

from app.database import db
from app.recipe.recipe_schemas import (
    RecipeCreateSchema,
    RecipeUpdateSchema,
    RecipeUpdateSchemaOptional,
)


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
async def create_recipe(data: RecipeCreateSchema):
    recipe_dict = data.model_dump(by_alias=True)

    recipe_dict["created_at"] = datetime.utcnow()
    recipe_dict["updated_at"] = datetime.utcnow()

    for ing in recipe_dict.get("ingredients", []):
        if "_id" in ing:
            try:
                ing["_id"] = ObjectId(ing["_id"])
            except Exception:
                pass

    result = await db.recipes.insert_one(recipe_dict)

    recipe_dict["_id"] = str(result.inserted_id)

    for ing in recipe_dict.get("ingredients", []):
        if "_id" in ing and isinstance(ing["_id"], ObjectId):
            ing["_id"] = str(ing["_id"])

    return recipe_dict


# -------------------- Повне оновлення рецепту --------------------
async def update_recipe(recipe_id: str, data: RecipeUpdateSchema):
    try:
        obj_id = ObjectId(recipe_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid recipe ID")

    raw_data = data.model_dump(by_alias=True)

    # Конвертация ingredient _id в ObjectId
    for ing in raw_data.get("ingredients", []):
        if "_id" in ing:
            try:
                ing["_id"] = ObjectId(ing["_id"])
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid ingredient ID")

    raw_data["updated_at"] = datetime.utcnow()

    result = await db.recipes.update_one(
        {"_id": obj_id},
        {"$set": raw_data},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return {
        "status": "success",
        "updated_fields": list(raw_data.keys()),
        "matched_count": result.matched_count,
    }


# -------------------- Часткове оновлення рецепту --------------------
async def update_recipe_optional(recipe_id: str, data: RecipeUpdateSchemaOptional):
    try:
        obj_id = ObjectId(recipe_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid recipe ID")

    raw_data = data.model_dump(by_alias=True, exclude_unset=True)

    if not raw_data:
        return {
            "status": "success",
            "updated_fields": [],
            "matched_count": 0,
        }

    if "ingredients" in raw_data:
        for ing in raw_data["ingredients"]:
            if "_id" in ing:
                try:
                    ing["_id"] = ObjectId(ing["_id"])
                except Exception:
                    raise HTTPException(status_code=400, detail="Invalid ingredient ID")

    raw_data["updated_at"] = datetime.utcnow()

    result = await db.recipes.update_one(
        {"_id": obj_id},
        {"$set": raw_data},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return {
        "status": "success",
        "updated_fields": list(raw_data.keys()),
        "matched_count": result.matched_count,
    }


# -------------------- Пошук рецептів за назвою продукту --------------------
async def search_recipes_by_ingredient_name(name: str):
    if not name.strip():
        raise HTTPException(status_code=400, detail="Invalid query")

    pipeline = [
        {"$unwind": "$ingredients"},
        {
            "$lookup": {
                "from": "products",
                "localField": "ingredients._id",
                "foreignField": "_id",
                "as": "product",
            }
        },
        {"$unwind": "$product"},
        {"$match": {"product.name": {"$regex": name, "$options": "i"}}},
        {
            "$group": {
                "_id": "$_id",
                "name": {"$first": "$name"},
                "goal": {"$first": "$goal"},
                "cooking_time": {"$first": "$cooking_time"},
                "difficulty": {"$first": "$difficulty"},
                "number_of_servings": {"$first": "$number_of_servings"},
                "utensils": {"$first": "$utensils"},
                "ingredients": {"$push": "$ingredients"},
                "steps": {"$first": "$steps"},
                "total_nutrition_per_serving": {"$first": "$total_nutrition_per_serving"},
                "created_at": {"$first": "$created_at"},
                "updated_at": {"$first": "$updated_at"},
            }
        },
        {"$limit": 50},
    ]

    cursor = db.recipes.aggregate(pipeline)
    results = await cursor.to_list(length=50)

    for recipe in results:
        recipe["_id"] = str(recipe["_id"])
        for ing in recipe.get("ingredients", []):
            if "_id" in ing and isinstance(ing["_id"], ObjectId):
                ing["_id"] = str(ing["_id"])

    return {"recipes": results}


# -------------------- Отримати рецепт за ID --------------------
async def get_recipe(recipe_id: str):
    try:
        obj_id = ObjectId(recipe_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid recipe ID")

    recipe = await db.recipes.find_one({"_id": obj_id})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    recipe["_id"] = str(recipe["_id"])
    for ing in recipe.get("ingredients", []):
        if "_id" in ing and isinstance(ing["_id"], ObjectId):
            ing["_id"] = str(ing["_id"])

    return recipe
