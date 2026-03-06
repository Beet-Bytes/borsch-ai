from fastapi import APIRouter, Depends, HTTPException

from app.recipe.recipe_schemas import (
    RecipeCreateSchema,
    RecipeResponseSchema,
    RecipeSearchResponse,
    RecipeUpdateSchema,
    RecipeUpdateSchemaOptional,
    RecommendRequestSchema,
    UpdateRecipeResponse,
)
from app.recipe.recipe_service import (
    create_recipe,
    get_recipe,
    recommend_recipes,
    search_recipes_by_ingredient_name,
    update_recipe,
    update_recipe_optional,
)
from app.user.authorization.auth_middleware import get_current_user

router = APIRouter(prefix="/recipes", tags=["Recipes"])


# -------------------- POST /recipes/create --------------------
# Створити новий рецепт
@router.post(
    "/create",
    response_model=RecipeResponseSchema,
    summary="Create a new recipe",
    description="Creates a new recipe with ingredients, cooking steps, and nutrition per serving.",
    responses={
        200: {
            "description": "Recipe successfully created",
            "content": {"application/json": {"example": "69a091b428e5eb9ad7ae904c"}},
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
async def create_new_recipe(data: RecipeCreateSchema):
    return await create_recipe(data)


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
    return await update_recipe(recipe_id, data)


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


# -------------------- GET /recipes/search --------------------
# Пошук рецептів за назвою продукту
@router.get(
    "/search",
    response_model=RecipeSearchResponse,
    summary="Search recipes by product name",
    description="Searches for recipes that contain a product with the specified name.",
    responses={
        200: {
            "description": "Recipes successfully retrieved",
            "content": {
                "application/json": {
                    "example": {
                        "recipes": [
                            {
                                "_id": "69a091b428e5eb9ad7ae904c",
                                "name": "Scrambled Eggs",
                                "goal": "muscle_gain",
                                "cooking_time": 10,
                                "difficulty": "easy",
                                "number_of_servings": 2,
                                "utensils": ["Pan", "Spatula"],
                                "ingredients": [{"_id": "69a08f6f28e5eb9ad7ae9034", "quantity": 3}],
                                "steps": [
                                    {"step_number": 1, "instruction": "Crack eggs into bowl."}
                                ],
                                "total_nutrition_per_serving": {
                                    "calories": 250,
                                    "protein": 18,
                                    "fat": 19,
                                    "carbs": 2,
                                },
                                "created_at": "2026-03-02T10:00:00Z",
                                "updated_at": "2026-03-02T10:00:00Z",
                            }
                        ]
                    }
                }
            },
        },
        400: {
            "description": "Invalid query parameter",
            "content": {
                "application/json": {
                    "example": {"detail": "Query parameter 'name' must not be empty"}
                }
            },
        },
        404: {
            "description": "No recipes found",
            "content": {"application/json": {"example": {"detail": "No recipes found"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def search_recipes(name: str):
    if not name.strip():
        raise HTTPException(status_code=400, detail="Invalid query")

    return await search_recipes_by_ingredient_name(name)


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
                            {"_id": "69a08f6f28e5eb9ad7ae9034", "quantity": 50},
                            {"_id": "69a08f6f28e5eb9ad7ae9035", "quantity": 200},
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


# -------------------- POST /recipes/recommend --------------------
@router.post(
    "/recommend",
    response_model=RecipeSearchResponse,
    summary="Recommend recipes based on ingredients",
    description="Returns top recipes based on ingredient overlap and filters out user's hard constraints (e.g., allergies).",
)
async def get_recommendations(
    data: RecommendRequestSchema, user_id: str = Depends(get_current_user)
):
    if not data.ingredients:
        raise HTTPException(status_code=400, detail="Ingredient list cannot be empty")

    return await recommend_recipes(user_id, data.ingredients)
