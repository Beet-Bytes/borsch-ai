import os

from fastapi import APIRouter, Depends, File, Response, UploadFile

from app.user.authorization.auth_middleware import get_current_user
from app.user.photos_uploader.upload_service import get_avatar_bytes_from_s3, upload_avatar_to_s3
from app.user.profile.profile_service import update_user_profile_optional
from app.user.user_schemas import UserProfileUpdateOptional

router = APIRouter(tags=["Upload Photos"])

BASE_API_URL = os.getenv("BASE_API_URL", "http://localhost:8000")


# -------------------- POST /profile/avatar --------------------
# Завантажити аватар користувача
@router.post("/profile/avatar", summary="Upload user avatar")
async def upload_avatar(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    url, file_key = await upload_avatar_to_s3(file, user_id)

    proxy_url = f"{BASE_API_URL}/profile/avatar/{file_key}"

    await update_user_profile_optional(
        user_id,
        UserProfileUpdateOptional(profile={"avatar_url": proxy_url}),
    )

    return {"avatar_url": proxy_url, "file_key": file_key}


# -------------------- GET /profile/avatar/{file_key} --------------------
# Отримати аватар користувача через proxy
@router.get("/profile/avatar/{file_key:path}", summary="Get user avatar (proxy)")
async def get_avatar(file_key: str):
    file_bytes = await get_avatar_bytes_from_s3(file_key)

    extension = file_key.split(".")[-1].lower()

    # Map file extension to appropriate MIME type
    mime_type = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
        "heic": "image/heic",
        "heif": "image/heif",
        "bmp": "image/bmp",
        "tiff": "image/tiff",
        "tif": "image/tiff",
    }.get(extension, "application/octet-stream")

    return Response(content=file_bytes, media_type=mime_type)
