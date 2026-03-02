from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# -------------------- Харчова цінність на 100 г --------------------
class NutritionPer100gSchema(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)
    carbs: float = Field(..., ge=0)


# -------------------- Створення продукту --------------------
class ProductCreateSchema(BaseModel):
    name: str
    category: str
    nutrition_per_100g: NutritionPer100gSchema


# -------------------- Повне оновлення продукту --------------------
class ProductUpdateSchema(BaseModel):
    name: str
    category: str
    nutrition_per_100g: NutritionPer100gSchema


# -------------------- Часткове оновлення продукту --------------------
class ProductUpdateSchemaOptional(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    nutrition_per_100g: Optional[NutritionPer100gSchema] = None


# -------------------- Відповідь: Продукт --------------------
class ProductResponseSchema(BaseModel):
    name: str
    category: str
    nutrition_per_100g: NutritionPer100gSchema
    created_at: datetime
    updated_at: datetime


# -------------------- Відповідь після оновлення продукту --------------------
class UpdateProductResponse(BaseModel):
    status: str
    updated_fields: list[str]
    matched_count: int
