from datetime import date, datetime

from app.database import db
from app.user.user_schemas import UserProfileUpdateOptional


# -------------------- Функція для "плоского" словника --------------------
# Перетворює вкладений словник на плоский з ключами через крапку.
# Потрібно для оновлення вкладених полів у MongoDB через $set.
def flatten_dict(d, prefix=""):
    items = []
    for k, v in d.items():
        new_key = f"{prefix}.{k}" if prefix else k

        if isinstance(v, date) and not isinstance(v, datetime):
            v = datetime.combine(v, datetime.min.time())

        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key).items())
        else:
            items.append((new_key, v))

    return dict(items)


# -------------------- Сервис для повного оновлення профілю --------------------
# Оновити повний профіль користувача
async def update_user_profile(user_id: str, raw_data: dict):
    for field in ["email", "password_hash", "role"]:
        raw_data.pop(field, None)

    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": update_query},
        upsert=True,
    )

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }


# -------------------- Сервис для часткового оновлення профілю --------------------
# Часткове оновлення профілю користувача
async def update_user_profile_optional(user_id: str, data: UserProfileUpdateOptional):
    raw_data = data.model_dump(exclude_unset=True)
    if not raw_data:
        return {"status": "success", "updated_fields": [], "matched_count": 0}

    for field in ["email", "password_hash", "role"]:
        raw_data.pop(field, None)

    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": update_query},
        upsert=True,
    )

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }


# -------------------- Сервис для отримання профілю --------------------
# Отримати профіль користувача
async def get_user_profile(user_id: str):
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})

    if not user:
        return {"message": "Profile not found"}

    return user
