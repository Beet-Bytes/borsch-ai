from fastapi import APIRouter, Depends

from app.user.authorization.auth_middleware import get_current_user
from app.user.user_schemas import UserProfileUpdate
from app.user.profile.profile_service import (
    update_user_profile,
    get_user_profile,
)

router = APIRouter(tags=["Profile"])


@router.put("/profile")
async def update_profile(
    data: UserProfileUpdate,
    user_id: str = Depends(get_current_user),
):
    raw_data = data.model_dump(exclude_unset=True)
    return await update_user_profile(user_id, raw_data)


@router.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    return await get_user_profile(user_id)
