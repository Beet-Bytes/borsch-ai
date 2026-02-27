from fastapi import APIRouter, Depends

from app.user.authorization.auth_middleware import get_current_user
from app.user.profile.profile_service import (
    get_user_profile,
    update_user_profile,
    update_user_profile2,
)
from app.user.user_schemas import (
    ProfileSchema,
    UpdateProfileResponse,
    UserProfileUpdate,
    UserProfileUpdate2,
)

router = APIRouter(tags=["Profile"])


@router.put(
    "/profile",
    response_model=UpdateProfileResponse,
    summary="Оновити профіль користувача",
    description="Дозволяє оновити дані профілю поточного користувача. "
    "Заборонено змінювати email, пароль та роль.",
    responses={
        200: {
            "description": "Профіль успішно оновлено",
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
            "description": "Некоректні дані у запиті",
            "content": {"application/json": {"example": {"detail": "Invalid input data"}}},
        },
        401: {
            "description": "Неавторизований доступ",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        500: {
            "description": "Внутрішня помилка сервера",
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


@router.get(
    "/profile",
    response_model=ProfileSchema,
    summary="Отримати профіль користувача",
    description="Повертає дані профілю поточного користувача, включаючи ім’я, дату народження, локаль та часовий пояс.",
    responses={
        200: {
            "description": "Профіль знайдено",
            "content": {
                "application/json": {
                    "example": {
                        "first_name": "Дмитро",
                        "last_name": "Іванов",
                        "birthDate": "1990-05-12",
                        "avatar_url": "https://example.com/avatar.png",
                        "locale": "uk-UA",
                        "timezone": "Europe/Kiev",
                    }
                }
            },
        },
        401: {
            "description": "Неавторизований доступ",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        404: {
            "description": "Профіль не знайдено",
            "content": {"application/json": {"example": {"detail": "User not found"}}},
        },
        500: {
            "description": "Внутрішня помилка сервера",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def get_profile(user_id: str = Depends(get_current_user)):
    return await get_user_profile(user_id)


# ------------------- Новый PUT для partial update -------------------
@router.put(
    "/profile2",
    response_model=UpdateProfileResponse,
    summary="Частково оновити профіль користувача",
    description="Дозволяє частково оновити дані профілю поточного користувача. "
    "Заборонено змінювати email, пароль та роль.",
)
async def update_profile2(
    data: UserProfileUpdate2,
    user_id: str = Depends(get_current_user),
):
    return await update_user_profile2(user_id, data)
