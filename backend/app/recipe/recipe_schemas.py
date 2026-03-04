from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# -------------------- Харчова цінність на порцію --------------------
class NutritionPerServingSchema(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)
    carbs: float = Field(..., ge=0)


# -------------------- Інгредієнт --------------------
class RecipeIngredientSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    quantity: float = Field(..., ge=0)
    unit: str


# -------------------- Крок рецепту --------------------
class RecipeStepSchema(BaseModel):
    step_number: int = Field(..., ge=1)
    instruction: str


# -------------------- Схема для створення рецепту --------------------
class RecipeCreateSchema(BaseModel):
    name: str
    goal: str
    cooking_time: int = Field(..., ge=0)
    difficulty: str
    number_of_servings: int = Field(..., ge=1)
    utensils: List[str]
    ingredients: List[RecipeIngredientSchema] = Field(
        ...,
        example=[
            {"_id": "69a08f6f28e5eb9ad7ae9045", "quantity": 130, "unit": "g"},
            {"_id": "69a08f6f28e5eb9ad7ae9046", "quantity": 50, "unit": "g"},
        ],
    )
    steps: List[RecipeStepSchema]
    total_nutrition_per_serving: NutritionPerServingSchema


# -------------------- Схема для повного оновлення рецепту --------------------
class RecipeUpdateSchema(BaseModel):
    name: str
    goal: str
    cooking_time: int = Field(..., ge=0)
    difficulty: str
    number_of_servings: int = Field(..., ge=1)
    utensils: List[str]
    ingredients: List[RecipeIngredientSchema]
    steps: List[RecipeStepSchema]
    total_nutrition_per_serving: NutritionPerServingSchema


# -------------------- Схема для часткового оновлення рецепту --------------------
class RecipeUpdateSchemaOptional(BaseModel):
    name: Optional[str] = None
    goal: Optional[str] = None
    cooking_time: Optional[int] = Field(None, ge=0)
    difficulty: Optional[str] = None
    number_of_servings: Optional[int] = Field(None, ge=1)
    utensils: Optional[List[str]] = None
    ingredients: Optional[List[RecipeIngredientSchema]] = None
    steps: Optional[List[RecipeStepSchema]] = None
    total_nutrition_per_serving: Optional[NutritionPerServingSchema] = None


# -------------------- Схема відповіді при отриманні рецепту --------------------
class RecipeResponseSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    name: str
    goal: str
    cooking_time: int
    difficulty: str
    number_of_servings: int
    utensils: List[str]
    ingredients: List[RecipeIngredientSchema]
    steps: List[RecipeStepSchema]
    total_nutrition_per_serving: NutritionPerServingSchema
    created_at: datetime
    updated_at: datetime


# -------------------- Схема відповіді після оновлення рецепту --------------------
class UpdateRecipeResponse(BaseModel):
    status: str
    updated_fields: list[str]
    matched_count: int


# -------------------- Схема відповіді при пошуку рецептів --------------------
class RecipeSearchResponse(BaseModel):
    recipes: List[RecipeResponseSchema]


class RecommendRequestSchema(BaseModel):
    ingredients: List[str] = Field(
        ..., description="List of ingredient names available from the fridge"
    )
