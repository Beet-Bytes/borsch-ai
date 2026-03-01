from fastapi import APIRouter, Depends

from app.user.authorization.auth_middleware import get_current_user
from app.user.profile.profile_service import (
    get_user_profile,
    update_user_profile,
    update_user_profile_optional,
)
from app.user.user_schemas import (
    ProfileSchema,
    UpdateProfileResponse,
    UserProfileUpdate,
    UserProfileUpdateOptional,
)

router = APIRouter(tags=["Profile"])


# -------------------- PUT /profile --------------------
# Оновити повний профіль користувача
@router.put(
    "/profile/update",
    response_model=UpdateProfileResponse,
    summary="Update full user profile",
    description=(
        "Updates the full profile of the current user. "
        "Changing email, password, and role is not allowed. "
        "All required fields must be provided."
    ),
    responses={
        200: {
            "description": "Profile successfully updated",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "updated_fields": ["profile.first_name", "profile.last_name"],
                        "matched_count": 1,
                    }
                }
            },
        },
        400: {
            "description": "Invalid input data",
            "content": {"application/json": {"example": {"detail": "Invalid input data"}}},
        },
        401: {
            "description": "Unauthorized access",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def update_profile(
    data: UserProfileUpdate,
    user_id: str = Depends(get_current_user),
):
    raw_data = data.model_dump(exclude_unset=True)
    return await update_user_profile(user_id, raw_data)


# -------------------- PUT /profile_optional --------------------
# Часткове оновлення профілю користувача
@router.put(
    "/profile/update_optional",
    response_model=UpdateProfileResponse,
    summary="Partially update user profile",
    description=(
        "Partially updates the profile of the current user. "
        "Only the provided fields will be updated. "
        "Changing email, password, and role is not allowed."
    ),
    responses={
        200: {
            "description": "Profile successfully partially updated",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "updated_fields": ["profile.first_name", "ml_vector.novelty_seeking_index"],
                        "matched_count": 1,
                    }
                }
            },
        },
        400: {
            "description": "Invalid input data",
            "content": {"application/json": {"example": {"detail": "Invalid input data"}}},
        },
        401: {
            "description": "Unauthorized access",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def update_profile_optional(
    data: UserProfileUpdateOptional,
    user_id: str = Depends(get_current_user),
):
    return await update_user_profile_optional(user_id, data)


# -------------------- GET /profile --------------------
# Отримати профіль користувача
@router.get(
    "/profile",
    response_model=ProfileSchema,
    summary="Get user profile",
    description=(
        "Returns the current user's profile, including first name, last name, "
        "birth date, avatar URL, locale, and timezone."
    ),
    responses={
        200: {
            "description": "Profile retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "first_name": "Dmytro",
                        "last_name": "Ivanov",
                        "birthDate": "1990-05-12",
                        "avatar_url": "https://example.com/avatar.png",
                        "locale": "en-US",
                        "timezone": "Europe/Kiev",
                    }
                }
            },
        },
        401: {
            "description": "Unauthorized access",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        404: {
            "description": "Profile not found",
            "content": {"application/json": {"example": {"detail": "User not found"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def get_profile(user_id: str = Depends(get_current_user)):
    full_user = await get_user_profile(user_id)

    return full_user["profile"]
