from datetime import datetime

from fastapi import APIRouter, Header, HTTPException, Response

from app.database import db
from app.user.authorization.auth_schemas import ConfirmRequest, LoginRequest, RegisterRequest
from app.user.authorization.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authorization"])
auth_service = AuthService()


# -------------------- POST /auth/register --------------------
@router.post(
    "/register",
    summary="Register a new user",
    description=(
        "Registers a new user with email and password. "
        "User must agree to Terms & Privacy. "
        "Sends confirmation email after registration."
    ),
    responses={
        200: {
            "description": "User successfully registered",
            "content": {
                "application/json": {
                    "example": {
                        "message": "User registered. Check your email for confirmation.",
                        "user_id": "uuid-of-user",
                    }
                }
            },
        },
        400: {
            "description": "Invalid input or agreement not accepted",
            "content": {
                "application/json": {"example": {"detail": "You must agree to Terms & Privacy"}}
            },
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
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


# -------------------- POST /auth/confirm --------------------
@router.post(
    "/confirm",
    summary="Confirm user registration",
    description="Confirms user's email using confirmation code sent via email.",
    responses={
        200: {
            "description": "Email successfully confirmed",
            "content": {
                "application/json": {
                    "example": {"status": "success", "message": "Email successfully confirmed."}
                }
            },
        },
        400: {
            "description": "Invalid confirmation code or email",
            "content": {"application/json": {"example": {"detail": "Invalid confirmation code"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
def confirm_registration(request: ConfirmRequest):
    auth_service.confirm_user(request.email, request.confirmation_code)
    return {"status": "success", "message": "Email successfully confirmed."}


# -------------------- POST /auth/login --------------------
@router.post(
    "/login",
    summary="User login",
    description="Authenticates user and returns access, id, and refresh tokens.",
    responses={
        200: {
            "description": "Login successful",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "access-token",
                        "id_token": "id-token",
                        "refresh_token": "refresh-token",
                        "token_type": "Bearer",
                    }
                }
            },
        },
        401: {
            "description": "Incorrect email or password",
            "content": {"application/json": {"example": {"detail": "Incorrect email or password"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
def login(request: LoginRequest, response: Response):
    auth_result = auth_service.authenticate_user(request.email, request.password)

    response.set_cookie(
        key="access_token",
        value=auth_result["AccessToken"],
        httponly=True,
        secure=False,  # TODO: when we set our product in production, set secure to True
        samesite="lax",  # TODO: opt set samesite to strict
        max_age=3600,
    )

    return {"message": "Login successful"}


# -------------------- POST /auth/logout --------------------
@router.post(
    "/logout",
    summary="Logout user",
    description="Logs out user locally and from Cognito by invalidating access token.",
    responses={
        200: {
            "description": "Logout successful",
            "content": {
                "application/json": {
                    "example": {"message": "Successfully logged out local session and Cognito"}
                }
            },
        },
        401: {
            "description": "Unauthorized access or invalid token",
            "content": {"application/json": {"example": {"detail": "Token has been revoked"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def logout(response: Response, authorization: str = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

        await auth_service.logout_user(token)

    response.delete_cookie("access_token")

    return {"message": "Successfully logged out local session and Cognito"}
