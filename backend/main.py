from datetime import date, datetime

from database import db
from fastapi import FastAPI, Depends
from schemas import UserProfileUpdate
from auth_schemas import RegisterRequest, ConfirmRequest, LoginRequest
from auth_service import sign_up_user, confirm_user, authenticate_user
from auth_middleware import get_current_user

app = FastAPI(title="AI Borsch API")


@app.get("/")
def read_root():
    return {"message": "Borsch AI Backend is running!", "status": "active"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/auth/register")
async def register(request: RegisterRequest):
    user_sub = sign_up_user(request.email, request.password)

    new_user = {
        "user_id": user_sub,
        "email": request.email,
        "role": "user",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    await db.user.insert_one(new_user)

    return {"message": "User registered. Check your email for confirmation.", "user_id": user_sub}


@app.post("/auth/confirm")
def confirm_registration(request: ConfirmRequest):
    confirm_user(request.email, request.confirmation_code)
    return {"status": "success", "message": "Email successfully confirmed."}


@app.post("/auth/login")
def login(request: LoginRequest):
    auth_result = authenticate_user(request.email, request.password)
    return {
        "access_token": auth_result["AccessToken"],
        "id_token": auth_result["IdToken"],
        "refresh_token": auth_result.get("RefreshToken"),
        "token_type": "Bearer",
    }


@app.put("/profile")
async def update_profile(data: UserProfileUpdate, user_id: str = Depends(get_current_user)):
    profile_data = data.profile.model_dump(exclude_unset=True)
    update_query = {}

    for k, v in profile_data.items():
        if isinstance(v, date) and not isinstance(v, datetime):
            v = datetime.combine(v, datetime.min.time())
        update_query[f"profile.{k}"] = v

    update_query["updated_at"] = datetime.utcnow()

    await db.user.update_one({"user_id": user_id}, {"$set": update_query}, upsert=True)

    return {"status": "success", "updated_fields": list(update_query.keys()), "user_id": user_id}


@app.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    """Example of a secure GET route for obtaining a profile"""
    user = await db.user.find_one({"user_id": user_id}, {"_id": 0})
    if not user:
        return {"message": "Profile not found"}
    return user
