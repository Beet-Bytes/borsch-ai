from datetime import date, datetime

from auth_middleware import get_current_user
from auth_schemas import ConfirmRequest, LoginRequest, RegisterRequest
from auth_service import authenticate_user, confirm_user, sign_up_user
from database import db
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import UserProfileUpdate

app = FastAPI(title="AI Borsch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.put("/profile")
async def update_profile(data: UserProfileUpdate, user_id: str = Depends(get_current_user)):
    raw_data = data.model_dump(exclude_unset=True)

    for field in ["email", "password_hash", "role"]:
        raw_data.pop(field, None)

    update_query = flatten_dict(raw_data)
    update_query["updated_at"] = datetime.utcnow()

    search_filter = {"user_id": user_id}

    result = await db.user.update_one(search_filter, {"$set": update_query}, upsert=True)

    return {
        "status": "success",
        "updated_fields": list(update_query.keys()),
        "matched_count": result.matched_count,
    }


@app.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    """Example of a secure GET route for obtaining a profile"""
    user = await db.user.find_one({"user_id": user_id}, {"_id": 0})
    if not user:
        return {"message": "Profile not found"}
    return user
