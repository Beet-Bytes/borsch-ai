from datetime import datetime

from bson import ObjectId
from fastapi import HTTPException

from app.database import db
from app.product.product_schemas import ProductUpdateSchemaOptional


# -------------------- Функція для "плоского" словника --------------------
# Перетворює вкладений словник у формат з ключами через крапку.
# Необхідно для оновлення вкладених полів у MongoDB через оператор $set.
def flatten_dict(d, prefix=""):
    items = []
    for k, v in d.items():
        new_key = f"{prefix}.{k}" if prefix else k

        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key).items())
        else:
            items.append((new_key, v))

    return dict(items)


# -------------------- Сервіс створення продукту --------------------
# Створює новий продукт та додає часові мітки created_at і updated_at.
async def create_product(data):
    product_dict = data.model_dump()

    product_dict["created_at"] = datetime.utcnow()
    product_dict["updated_at"] = datetime.utcnow()

    result = await db.products.insert_one(product_dict)
    return str(result.inserted_id)


# -------------------- Сервіс повного оновлення продукту --------------------
# Повністю оновлює всі поля продукту за його ID.
async def update_product(product_id: str, raw_data: dict):
    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    result = await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_query},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }


# -------------------- Сервіс часткового оновлення продукту --------------------
# Оновлює лише ті поля, які були передані в запиті.
async def update_product_optional(product_id: str, data: ProductUpdateSchemaOptional):
    raw_data = data.model_dump(exclude_unset=True)

    if not raw_data:
        return {"status": "success", "updated_fields": [], "matched_count": 0}

    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    result = await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_query},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }


# -------------------- Сервіс отримання продукту --------------------
# Повертає продукт за його ID.
async def get_product(product_id: str):
    product = await db.products.find_one(
        {"_id": ObjectId(product_id)},
        {"_id": 0},
    )

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


# -------------------- Сервіс пошуку продуктів --------------------
# Шукає продукти за назвою (regex, case-insensitive) для UI модалки.
async def search_products_by_name(query: str, limit: int = 10):
    if not query.strip():
        return []

    # Шукаємо збіги в полі name, ігноруючи регістр ($options: "i")
    cursor = db.products.find(
        {"name": {"$regex": query, "$options": "i"}}, {"_id": 1, "name": 1, "category": 1}
    ).limit(limit)

    products = await cursor.to_list(length=limit)

    result = []
    for p in products:
        p["id"] = str(p.pop("_id"))
        result.append(p)

    return result
