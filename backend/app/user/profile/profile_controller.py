from fastapi import APIRouter, Depends
from app.user.authorization.auth_middleware import get_current_user
from app.user.profile.profile_service import (
    get_user_profile,
    update_user_profile,
    update_user_profile_optional,
)
from app.user.user_schemas import (
    UpdateProfileResponse,
    UserProfileUpdate,
    UserProfileUpdateOptional,
    UserResponseSchema,
)

router = APIRouter(tags=["Profile"])


# Прибрали /{user_id} з роуту
@router.put("/profile/update")
async def update_profile(
    data: UserProfileUpdate,
    user_id: str = Depends(get_current_user),
):
    raw_data = data.model_dump(exclude_unset=True)
    return await update_user_profile(user_id, raw_data)


# Прибрали /{user_id} з роуту
@router.put("/profile/update_optional")
async def update_profile_optional(
    data: UserProfileUpdateOptional,
    user_id: str = Depends(get_current_user),
):
    return await update_user_profile_optional(user_id, data)


# Прибрали /{user_id} з роуту
@router.get("/profile", response_model=UserResponseSchema)
async def get_profile(user_id: str = Depends(get_current_user)):
    full_user = await get_user_profile(user_id)
    if "user_id" not in full_user:
        full_user["user_id"] = user_id
    return full_user
