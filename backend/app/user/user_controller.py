import jwt
from fastapi import APIRouter, Depends, Request

from app.user.authorization.auth_middleware import get_current_user

router = APIRouter(prefix="/users")


@router.get("/me")
async def get_me(request: Request, user_id: str = Depends(get_current_user)):
    """
    Повертає поточного юзера та його роль з Cognito-токена.
    """
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        groups = payload.get("cognito:groups", [])

        role = "admin" if "admin" in [g.lower() for g in groups] else "user"

        return {"user_id": user_id, "role": role}
    except Exception:
        return {"user_id": user_id, "role": "user"}
