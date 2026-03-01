from datetime import date, datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


# -------------------- Біометричні дані користувача --------------------
class BiometricsSchema(BaseModel):
    weight_kg: Optional[float] = Field(None, ge=0, le=620)
    target_weight: Optional[float] = Field(None, ge=0)
    height_cm: Optional[float] = Field(None, ge=0, le=280)
    gender: Optional[str] = None
    activityLevel: Optional[str] = None
    goal: Optional[str] = None


# -------------------- Переважна кількість порцій --------------------
class PreferencesSchema(BaseModel):
    default_portions: Optional[int] = None
    meals_per_day: Optional[int] = None


# -------------------- Обмеження для рецептів --------------------
class HardConstraintsSchema(BaseModel):
    diet: Optional[str] = None
    allergies: Optional[List[str]] = None
    excluded_ingredients: Optional[List[str]] = None
    kitchen_equipment: Optional[List[str]] = None
    max_cooking_time_mins: Optional[int] = None


# -------------------- Бажаний розподіл макронутрієнтів --------------------
class PreferredMacrosSchema(BaseModel):
    protein_pct: Optional[int] = None
    carbs_pct: Optional[int] = None
    fat_pct: Optional[int] = None


# -------------------- Смакові вподобання --------------------
class TastePreferencesSchema(BaseModel):
    spicy_score: Optional[float] = None
    sweet_score: Optional[float] = None
    salty_score: Optional[float] = None


# -------------------- Підписка (Required) --------------------
class MLVectorSchema(BaseModel):
    avg_prep_time_pref: Optional[float] = None
    avg_difficulty_pref: Optional[float] = None
    historical_vegan_rate: Optional[float] = None
    preferred_macros: Optional[PreferredMacrosSchema] = None
    taste_preferences: Optional[TastePreferencesSchema] = None
    cuisine_preferences: Dict[str, float] = Field(
        default_factory=dict, json_schema_extra={"example": {"ukrainian": 0.9}}
    )
    novelty_seeking_index: float = 0
    total_recipes_cooked: int = 0


# -------------------- ML-вектор (Optional) --------------------
class MLVectorUpdateSchemaOptional(BaseModel):
    avg_prep_time_pref: Optional[float] = None
    avg_difficulty_pref: Optional[float] = None
    historical_vegan_rate: Optional[float] = None
    preferred_macros: Optional[PreferredMacrosSchema] = None
    taste_preferences: Optional[TastePreferencesSchema] = None
    cuisine_preferences: Optional[Dict[str, float]] = None
    novelty_seeking_index: Optional[float] = None
    total_recipes_cooked: Optional[int] = None


# -------------------- Підписка (Required) --------------------
class SubscriptionSchema(BaseModel):
    plan: str = "free"
    expires_at: Optional[datetime]


# -------------------- Підписка (Optional) --------------------
class SubscriptionUpdateSchemaOptional(BaseModel):
    plan: Optional[str] = None
    expires_at: Optional[datetime] = None


# -------------------- Профіль користувача (Required) --------------------
class ProfileSchema(BaseModel):
    first_name: str
    last_name: str
    birthDate: Optional[date] = None
    avatar_url: Optional[str] = None
    locale: str
    timezone: str


# -------------------- Профіль користувача (Optional) --------------------
class ProfileUpdateSchemaOptional(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birthDate: Optional[date] = None
    avatar_url: Optional[str] = None
    locale: Optional[str] = None
    timezone: Optional[str] = None


# -------------------- Відповідь після оновлення профілю --------------------
class UpdateProfileResponse(BaseModel):
    status: str
    updated_fields: List[str]
    matched_count: int


# -------------------- Повне оновлення профілю (PUT) --------------------
class UserProfileUpdate(BaseModel):
    email: str
    password_hash: str
    role: str = "user"
    profile: ProfileSchema
    biometrics: BiometricsSchema
    preferences: PreferencesSchema
    hard_constraints: HardConstraintsSchema
    ml_vector: MLVectorSchema
    subscription: SubscriptionSchema
    created_at: datetime
    updated_at: datetime


# -------------------- Часткове оновлення профілю (PUT partial) --------------------
class UserProfileUpdateOptional(BaseModel):
    profile: Optional[ProfileUpdateSchemaOptional] = None
    biometrics: Optional[BiometricsSchema] = None
    preferences: Optional[PreferencesSchema] = None
    hard_constraints: Optional[HardConstraintsSchema] = None
    ml_vector: Optional[MLVectorUpdateSchemaOptional] = None
    subscription: Optional[SubscriptionUpdateSchemaOptional] = None


# -------------------- Відповідь: Повний профіль користувача (GET) --------------------
class UserResponseSchema(BaseModel):
    user_id: str
    email: str
    role: str
    created_at: datetime
    updated_at: datetime

    # Вкладені об'єкти використовують ваші існуючі схеми!
    profile: ProfileSchema
    biometrics: BiometricsSchema
    preferences: PreferencesSchema
    hard_constraints: HardConstraintsSchema
    ml_vector: MLVectorSchema
    subscription: SubscriptionSchema
