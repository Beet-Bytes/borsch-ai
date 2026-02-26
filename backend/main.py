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


@app.put("/profile/{user_id}")
async def update_profile(user_id: str, data: UserProfileUpdate):
    profile_data = data.profile.model_dump(exclude_unset=True)

    update_query = {}

    for k, v in profile_data.items():
        if isinstance(v, date) and not isinstance(v, datetime):
            v = datetime.combine(v, datetime.min.time())

        update_query[f"profile.{k}"] = v

    update_query["updated_at"] = datetime.utcnow()

    await db.user.update_one({"user_id": user_id}, {"$set": update_query}, upsert=True)

    return {"status": "success", "updated_fields": list(update_query.keys())}
