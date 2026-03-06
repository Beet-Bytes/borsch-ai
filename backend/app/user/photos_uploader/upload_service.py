import io
import os
from uuid import uuid4

import aioboto3
import pillow_heif
from dotenv import load_dotenv
from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps

pillow_heif.register_heif_opener()

load_dotenv()

# Отримуємо змінні для R2
R2_ENDPOINT_URL = os.getenv("R2_ENDPOINT_URL")
BUCKET_NAME = os.getenv("R2_BUCKET")

# Створюємо сесію з ключами R2
session = aioboto3.Session(
    aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
    region_name="auto",
)

USER_AVATARS_FOLDER = "user-avatars"
ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/bmp",
    "image/tiff",
]

MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
AVATAR_SIZE = (500, 500)


# -------------------- Сервис для завантаження аватара --------------------
async def upload_avatar_to_s3(file: UploadFile, user_id: str):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded or filename missing")

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported file type.")

    if file.size and file.size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail=f"File too large. Max: {MAX_FILE_SIZE_MB}MB.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail=f"File too large. Max: {MAX_FILE_SIZE_MB}MB.")

    try:
        image = Image.open(io.BytesIO(content))
        image = ImageOps.exif_transpose(image)

        width, height = image.size
        new_size = min(width, height)

        left = (width - new_size) / 2
        top = (height - new_size) / 2
        right = (width + new_size) / 2
        bottom = (height + new_size) / 2

        image = image.crop((left, top, right, bottom))
        image = image.resize(AVATAR_SIZE, Image.Resampling.LANCZOS)

        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA")

        output_buffer = io.BytesIO()
        image.save(output_buffer, format="WEBP", quality=85)

        content = output_buffer.getvalue()
        extension = "webp"
        content_type = "image/webp"

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file or format.")

    file_key = f"{USER_AVATARS_FOLDER}/{user_id}_{uuid4()}.{extension}"

    try:
        # ОБОВ'ЯЗКОВО: додаємо endpoint_url=R2_ENDPOINT_URL
        async with session.client("s3", endpoint_url=R2_ENDPOINT_URL) as s3_client:
            await s3_client.put_object(
                Bucket=BUCKET_NAME,
                Key=file_key,
                Body=content,
                ContentType=content_type,
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file to R2: {str(e)}")

    # Прибрали amazonaws, тепер формуємо універсальний або внутрішній URL
    url = f"{R2_ENDPOINT_URL}/{BUCKET_NAME}/{file_key}"
    return url, file_key


# -------------------- Сервис для отримання аватара з S3 --------------------
async def get_avatar_bytes_from_s3(file_key: str) -> bytes:
    try:
        # ОБОВ'ЯЗКОВО: додаємо endpoint_url=R2_ENDPOINT_URL
        async with session.client("s3", endpoint_url=R2_ENDPOINT_URL) as s3_client:
            response = await s3_client.get_object(Bucket=BUCKET_NAME, Key=file_key)
            return await response["Body"].read()
    except Exception as e:
        if "NoSuchKey" in str(e) or "Not Found" in str(e):
            raise HTTPException(status_code=404, detail="Avatar not found")
        raise HTTPException(status_code=500, detail=f"R2 Error: {str(e)}")
