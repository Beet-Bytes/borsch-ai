from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import StreamingResponse

from app.user.authorization.auth_middleware import get_current_user
from app.user.photos_uploader.upload_service import get_avatar_from_s3, upload_avatar_to_s3
from app.user.profile.profile_service import update_user_profile_optional
from app.user.user_schemas import UserProfileUpdateOptional

router = APIRouter(tags=["Upload Photos"])


@router.post("/profile/avatar", summary="Upload user avatar")
async def upload_avatar(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    # загружаем файл в S3
    url, file_key = await upload_avatar_to_s3(file, user_id)

    # обновляем профиль пользователя
    await update_user_profile_optional(
        user_id, UserProfileUpdateOptional(profile={"avatar_url": url})
    )

    return {"avatar_url": url, "file_key": file_key}


@router.get("/profile/avatar/{file_key}", summary="Get user avatar (proxy)")
async def get_avatar(file_key: str):
    # получаем файл из S3
    file_stream = await get_avatar_from_s3(file_key)

    # определяем mime-type по расширению файла
    extension = file_key.split(".")[-1].lower()
    mime_type = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
    }.get(extension, "application/octet-stream")

    return StreamingResponse(file_stream, media_type=mime_type)
