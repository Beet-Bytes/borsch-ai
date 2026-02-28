import os
from io import BytesIO
from uuid import uuid4

import boto3
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

# Конфигурация S3
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
)
BUCKET_NAME = os.getenv("AWS_S3_BUCKET")

# Константы для папок в бакете
USER_AVATARS_FOLDER = "user-avatars"
AI_PHOTOS_FOLDER = "photos-for-ai"
DISHES_PRODUCTS_FOLDER = "photos-of-dishes&products"

# Разрешённые типы изображений
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]


async def upload_avatar_to_s3(file, user_id: str):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded or filename missing")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    extension = file.filename.split(".")[-1]
    file_key = f"user-avatars/{user_id}_{uuid4()}.{extension}"

    try:
        s3_client.upload_fileobj(
            BytesIO(content),  # <- вот здесь передаём bytes
            BUCKET_NAME,
            file_key,
            ExtraArgs={"ACL": "public-read"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file to S3: {str(e)}")

    url = f"https://{BUCKET_NAME}.s3.{s3_client.meta.region_name}.amazonaws.com/{file_key}"
    return url, file_key


async def get_avatar_from_s3(file_key: str):
    try:
        s3_obj = s3_client.get_object(Bucket=BUCKET_NAME, Key=file_key)
        return s3_obj["Body"]
    except s3_client.exceptions.NoSuchKey:
        raise HTTPException(status_code=404, detail="Avatar not found")
