from datetime import date, datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class BiometricsSchema(BaseModel):
    weight_kg: Optional[float] = Field(None, ge=0, le=620)
    target_weight: Optional[float] = Field(None, ge=0)
    height_cm: Optional[float] = Field(None, ge=0, le=280)
    gender: Optional[str] = None
    activityLevel: Optional[str] = None
    goal: Optional[str] = None


class PreferencesSchema(BaseModel):
    default_portions: Optional[int] = None
    meals_per_day: Optional[int] = None


class HardConstraintsSchema(BaseModel):
    diet: Optional[str] = None
    allergies: Optional[List[str]] = None
    excluded_ingredients: Optional[List[str]] = None
    kitchen_equipment: Optional[List[str]] = None
    max_cooking_time_mins: Optional[int] = None


class PreferredMacrosSchema(BaseModel):
    protein_pct: Optional[int] = None
    carbs_pct: Optional[int] = None
    fat_pct: Optional[int] = None


class TastePreferencesSchema(BaseModel):
    spicy_score: Optional[float] = None
    sweet_score: Optional[float] = None
    salty_score: Optional[float] = None


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


class SubscriptionSchema(BaseModel):
    plan: str = "free"
    expires_at: Optional[datetime]


class ProfileSchema(BaseModel):
    first_name: str
    last_name: str
    birthDate: Optional[date] = None
    avatar_url: Optional[str] = None
    locale: str
    timezone: str


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
