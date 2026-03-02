from fastapi import APIRouter, Query

from app.recipe.recipe_schemas import (
    RecipeResponseSchema,
    RecipeSearchResponse,
    # RecipeCreateSchema,
    RecipeUpdateSchema,
    RecipeUpdateSchemaOptional,
    UpdateRecipeResponse,
)
from app.recipe.recipe_service import (
    get_recipe,
    search_recipes_by_name,
    # create_recipe,
    update_recipe,
    update_recipe_optional,
)

router = APIRouter(prefix="/recipes", tags=["Recipes"])


# -------------------- POST /recipes/create --------------------
# Створити новий рецепт
# @router.post(
#     "/create",
#     response_model=RecipeResponseSchema,
#     summary="Create a new recipe",
#     description="Creates a new recipe with ingredients, cooking steps, and nutrition per serving.",
#     responses={
#         200: {
#             "description": "Recipe successfully created",
#             "content": {"application/json": {"example": "69a091b428e5eb9ad7ae904c"}},
#         },
#         400: {
#             "description": "Invalid input data",
#             "content": {"application/json": {"example": {"detail": "Invalid input data"}}},
#         },
#         401: {
#             "description": "Unauthorized access",
#             "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
#         },
#         500: {
#             "description": "Internal server error",
#             "content": {"application/json": {"example": {"detail": "Internal server error"}}},
#         },
#     },
# )
# async def create_new_recipe(data: RecipeCreateSchema):
#     return await create_recipe(data)


# -------------------- PUT /recipes/update/{recipe_id} --------------------
# Повне оновлення рецепту
@router.put(
    "/update/{recipe_id}",
    response_model=UpdateRecipeResponse,
    summary="Full update of a recipe",
    description="Fully updates a recipe by ID. All required fields must be provided.",
    responses={
        200: {
            "description": "Recipe successfully updated",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "updated_fields": ["name", "ingredients", "steps"],
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
        404: {
            "description": "Recipe not found",
            "content": {"application/json": {"example": {"detail": "Recipe not found"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def update_recipe_full(recipe_id: str, data: RecipeUpdateSchema):
    raw_data = data.model_dump(exclude_unset=True)
    return await update_recipe(recipe_id, raw_data)


# -------------------- PUT /recipes/update_optional/{recipe_id} --------------------
# Часткове оновлення рецепту
@router.put(
    "/update_optional/{recipe_id}",
    response_model=UpdateRecipeResponse,
    summary="Partial update of a recipe",
    description="Partially updates a recipe by ID. Only the provided fields are updated.",
    responses={
        200: {
            "description": "Recipe successfully partially updated",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "updated_fields": ["steps"],
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
        404: {
            "description": "Recipe not found",
            "content": {"application/json": {"example": {"detail": "Recipe not found"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def update_recipe_partial(recipe_id: str, data: RecipeUpdateSchemaOptional):
    return await update_recipe_optional(recipe_id, data)


# -------------------- GET /recipes/{recipe_id} --------------------
# Отримати рецепт за ID
@router.get(
    "/{recipe_id}",
    response_model=RecipeResponseSchema,
    summary="Get recipe by ID",
    description="Returns full details of a recipe, including ingredients, steps, and nutrition per serving.",
    responses={
        200: {
            "description": "Recipe successfully retrieved",
            "content": {
                "application/json": {
                    "example": {
                        "_id": "69a091b428e5eb9ad7ae904c",
                        "name": "Oatmeal with berries and chia",
                        "goal": "weight_loss",
                        "cooking_time": 10,
                        "difficulty": "easy",
                        "number_of_servings": 1,
                        "utensils": ["Pot", "Spoon", "Bowl", "Knife", "Cutting board"],
                        "ingredients": [
                            {"_id": "69a08f6f28e5eb9ad7ae9034", "quantity": 50, "unit": "g"},
                            {"_id": "69a08f6f28e5eb9ad7ae9035", "quantity": 200, "unit": "ml"},
                        ],
                        "steps": [
                            {"step_number": 1, "instruction": "Put oat flakes into a pot."},
                            {"step_number": 2, "instruction": "Add milk and stir."},
                        ],
                        "total_nutrition_per_serving": {
                            "calories": 390,
                            "protein": 13,
                            "fat": 9,
                            "carbs": 65,
                        },
                        "created_at": "2026-02-24T00:00:00Z",
                        "updated_at": "2026-02-24T00:00:00Z",
                    }
                }
            },
        },
        400: {
            "description": "Invalid recipe ID format",
            "content": {"application/json": {"example": {"detail": "Invalid recipe ID"}}},
        },
        401: {
            "description": "Unauthorized access",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        404: {
            "description": "Recipe not found",
            "content": {"application/json": {"example": {"detail": "Recipe not found"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def get_recipe_by_id(recipe_id: str):
    return await get_recipe(recipe_id)


# -------------------- GET /recipes/search --------------------
# Пошук рецептів за назвою продукту
@router.get(
    "/search",
    response_model=RecipeSearchResponse,
    summary="Search recipes by product name",
    description="Returns a list of recipes that include a product with the specified name.",
    responses={
        200: {
            "description": "Recipes found",
            "content": {"application/json": {"example": {"recipes": []}}},
        },
        400: {
            "description": "Invalid query",
            "content": {"application/json": {"example": {"detail": "Invalid query"}}},
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
async def search_recipes(
    name: str = Query(..., min_length=1, description="Назва продукту для пошуку рецептів")
):
    return await search_recipes_by_name(name)
