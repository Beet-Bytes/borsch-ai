from datetime import datetime, date
from fastapi import APIRouter, Depends

from app.database import db
from app.user.authorization.auth_middleware import get_current_user
from app.user.user_schemas import UserProfileUpdate

router = APIRouter(tags=["Profile"])


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


@router.put("/profile")
async def update_profile(
    data: UserProfileUpdate,
    user_id: str = Depends(get_current_user),
):
    raw_data = data.model_dump(exclude_unset=True)

    for field in ["email", "password_hash", "role"]:
        raw_data.pop(field, None)

    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    result = await db.user.update_one(
        {"user_id": user_id},
        {"$set": update_query},
        upsert=True,
    )

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }


@router.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    user = await db.user.find_one({"user_id": user_id}, {"_id": 0})

    if not user:
        return {"message": "Profile not found"}

    return user
