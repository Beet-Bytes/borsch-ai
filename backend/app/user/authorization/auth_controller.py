from datetime import datetime

from fastapi import APIRouter

from app.database import db
from app.user.authorization.auth_schemas import ConfirmRequest, LoginRequest, RegisterRequest
from app.user.authorization.auth_service import authenticate_user, confirm_user, sign_up_user

router = APIRouter(prefix="/auth", tags=["Authorization"])


@router.post("/register")
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

    return {
        "message": "User registered. Check your email for confirmation.",
        "user_id": user_sub,
    }


@router.post("/confirm")
def confirm_registration(request: ConfirmRequest):
    confirm_user(request.email, request.confirmation_code)
    return {"status": "success", "message": "Email successfully confirmed."}


@router.post("/login")
def login(request: LoginRequest):
    auth_result = authenticate_user(request.email, request.password)

    return {
        "access_token": auth_result["AccessToken"],
        "id_token": auth_result["IdToken"],
        "refresh_token": auth_result.get("RefreshToken"),
        "token_type": "Bearer",
    }
