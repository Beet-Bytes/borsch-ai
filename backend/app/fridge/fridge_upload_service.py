import io
import os
from uuid import uuid4

import aioboto3
from fastapi import HTTPException
from PIL import Image, ImageOps

session = aioboto3.Session(
    aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
    region_name="auto",
)

BUCKET_NAME = os.getenv("R2_BUCKET")
S3_ENDPOINT_URL = os.getenv("R2_ENDPOINT_URL")

FRIDGE_SCANS_FOLDER = "fridge-scans"
MAX_IMAGE_DIMENSION = (1920, 1920)


async def upload_fridge_scan_to_s3(content: bytes) -> str:
    """
    Стискає фото холодильника і завантажує в S3/R2 анонімно.
    Повертає file_key, який буде використовуватися як scan_id.
    """
    try:
        image = Image.open(io.BytesIO(content))
        image = ImageOps.exif_transpose(image)
        image.thumbnail(MAX_IMAGE_DIMENSION, Image.Resampling.LANCZOS)

        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")

        output_buffer = io.BytesIO()
        image.save(output_buffer, format="WEBP", quality=80)
        optimized_content = output_buffer.getvalue()

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

    # ТЕПЕР ФАЙЛ АНОНІМНИЙ (тільки унікальний UUID)
    file_key = f"{FRIDGE_SCANS_FOLDER}/{uuid4().hex}.webp"

    try:
        async with session.client("s3", endpoint_url=S3_ENDPOINT_URL) as s3_client:
            await s3_client.put_object(
                Bucket=BUCKET_NAME,
                Key=file_key,
                Body=optimized_content,
                ContentType="image/webp",
            )
        return file_key

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 Error: {str(e)}")
