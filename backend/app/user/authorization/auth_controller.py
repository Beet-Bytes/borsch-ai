from datetime import datetime

from fastapi import APIRouter, Header, HTTPException, Response

from app.database import db
from app.user.authorization.auth_schemas import ConfirmRequest, LoginRequest, RegisterRequest
from app.user.authorization.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authorization"])
auth_service = AuthService()


@router.post("/register")
async def register(request: RegisterRequest):
    if not request.agreed_to_terms:
        raise HTTPException(status_code=400, detail="You must agree to Terms & Privacy")
    user_sub = auth_service.sign_up_user(request.email, request.password)

    new_user = {
        "user_id": user_sub,
        "email": request.email,
        "role": "user",
        "agreed_to_terms": True,
        "agreed_to_terms_at": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    await db.users.insert_one(new_user)

    return {
        "message": "User registered. Check your email for confirmation.",
        "user_id": user_sub,
    }


@router.post("/confirm")
def confirm_registration(request: ConfirmRequest):
    auth_service.confirm_user(request.email, request.confirmation_code)
    return {"status": "success", "message": "Email successfully confirmed."}


@router.post("/login")
def login(request: LoginRequest):
    auth_result = auth_service.authenticate_user(request.email, request.password)

    return {
        "access_token": auth_result["AccessToken"],
        "id_token": auth_result["IdToken"],
        "refresh_token": auth_result.get("RefreshToken"),
        "token_type": "Bearer",
    }


@router.post("/logout")
async def logout(response: Response, authorization: str = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

        await auth_service.logout_user(token)

    response.delete_cookie("access_token")

    return {"message": "Successfully logged out local session and Cognito"}
