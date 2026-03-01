import io
import os
from uuid import uuid4

import aioboto3
import pillow_heif
from dotenv import load_dotenv
from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps

# Enable HEIC/HEIF support in Pillow
pillow_heif.register_heif_opener()

load_dotenv()

session = aioboto3.Session(
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
)
BUCKET_NAME = os.getenv("AWS_S3_BUCKET")

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

    # Process image: fix orientation, center-crop, resize, and convert to WEBP
    try:
        image = Image.open(io.BytesIO(content))

        # Apply EXIF rotation to prevent sideways images from smartphones
        image = ImageOps.exif_transpose(image)

        # Calculate coordinates for a perfect center crop
        width, height = image.size
        new_size = min(width, height)

        left = (width - new_size) / 2
        top = (height - new_size) / 2
        right = (width + new_size) / 2
        bottom = (height + new_size) / 2

        image = image.crop((left, top, right, bottom))

        # Resize using high-quality LANCZOS filter
        image = image.resize(AVATAR_SIZE, Image.Resampling.LANCZOS)

        # Ensure RGBA mode to preserve transparency in WEBP format
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA")

        output_buffer = io.BytesIO()
        image.save(output_buffer, format="WEBP", quality=85)

        content = output_buffer.getvalue()
        extension = "webp"
        content_type = "image/webp"

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file or format.")

    # Upload optimized WEBP to S3
    file_key = f"{USER_AVATARS_FOLDER}/{user_id}_{uuid4()}.{extension}"

    try:
        async with session.client("s3") as s3_client:
            await s3_client.put_object(
                Bucket=BUCKET_NAME,
                Key=file_key,
                Body=content,
                ContentType=content_type,
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file to S3: {str(e)}")

    region = os.getenv("AWS_REGION")
    url = f"https://{BUCKET_NAME}.s3.{region}.amazonaws.com/{file_key}"
    return url, file_key


async def get_avatar_bytes_from_s3(file_key: str) -> bytes:
    try:
        async with session.client("s3") as s3_client:
            response = await s3_client.get_object(Bucket=BUCKET_NAME, Key=file_key)
            return await response["Body"].read()
    except Exception as e:
        if "NoSuchKey" in str(e):
            raise HTTPException(status_code=404, detail="Avatar not found")
        raise HTTPException(status_code=500, detail=f"S3 Error: {str(e)}")
