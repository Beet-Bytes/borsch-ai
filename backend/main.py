from datetime import date, datetime

from database import db
from fastapi import FastAPI
from schemas import UserProfileUpdate

app = FastAPI(title="AI Borsch API")


@app.get("/")
def read_root():
    return {"message": "Borsch AI Backend is running!", "status": "active"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


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


@app.put("/profile/{user_id}")
async def update_profile(user_id: str, data: UserProfileUpdate):
    raw_data = data.model_dump(exclude_unset=True)

    raw_data.pop("email", None)
    raw_data.pop("password_hash", None)
    raw_data.pop("role", None)

    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    search_filter = {"user_id": user_id}

    result = await db.user.update_one(search_filter, {"$set": update_query}, upsert=True)

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }
