import os

import httpx
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.user.authorization.auth_middleware import get_current_user

router = APIRouter(prefix="/fridge", tags=["Fridge Scanning"])

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL")
if not AI_SERVICE_URL:
    raise RuntimeError("AI_SERVICE_URL is not set in environment variables")


@router.post("/scan")
async def scan_fridge(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="The file must be an image")

    file_bytes = await file.read()
    predict_url = f"{AI_SERVICE_URL}/predict"

    async with httpx.AsyncClient() as client:
        try:
            files = {"file": (file.filename, file_bytes, file.content_type)}
            response = await client.post(predict_url, files=files, timeout=60.0)
            response.raise_for_status()

        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"AI Service is unavailable: {str(e)}")
        except httpx.HTTPStatusError:
            raise HTTPException(
                status_code=response.status_code, detail=f"AI Service error: {response.text}"
            )

    ai_data = response.json()
    detected_items = ai_data.get("ingredients", [])

    if detected_items:
        ingredient_names = [item["ingredient"] for item in detected_items]

        # await db.user.update_one(
        #     {"user_id": user_id},
        #     {"$addToSet": {"fridge_items": {"$each": ingredient_names}}}
        # )
        print(f"[INFO] Saved {len(ingredient_names)} items to user {user_id}'s fridge.")

    return ai_data
