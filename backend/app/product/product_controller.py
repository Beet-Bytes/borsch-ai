from typing import List
from fastapi import APIRouter, Query

from app.product.product_schemas import (
    ProductCreateSchema,
    ProductResponseSchema,
    ProductUpdateSchema,
    ProductUpdateSchemaOptional,
    UpdateProductResponse,
    ProductSearchResponseSchema,
)
from app.product.product_service import (
    create_product,
    get_product,
    update_product,
    update_product_optional,
    search_products_by_name,
)

router = APIRouter(prefix="/products", tags=["Products"])


# -------------------- POST /products/create --------------------
# Створити новий продукт
@router.post(
    "/create",
    response_model=str,
    summary="Create new product",
    description="Creates a new product with nutritional values per 100g.",
    responses={
        200: {
            "description": "Product successfully created",
            "content": {"application/json": {"example": "69a08f6f28e5eb9ad7ae9034"}},
        },
        400: {
            "description": "Invalid input data",
            "content": {"application/json": {"example": {"detail": "Invalid input data"}}},
        },
        401: {
            "description": "Unauthorized",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def create_new_product(data: ProductCreateSchema):
    return await create_product(data)


# -------------------- PUT /products/update/{product_id} --------------------
# Оновити повністю продукт
@router.put(
    "/update/{product_id}",
    response_model=UpdateProductResponse,
    summary="Update full product",
    description="Fully updates the product by ID. All required fields must be provided.",
    responses={
        200: {
            "description": "Product successfully updated",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "updated_fields": ["name", "category", "nutrition_per_100g.calories"],
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
            "description": "Unauthorized",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        404: {
            "description": "Product not found",
            "content": {"application/json": {"example": {"detail": "Product not found"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def update_product_full(product_id: str, data: ProductUpdateSchema):
    raw_data = data.model_dump(exclude_unset=True)
    return await update_product(product_id, raw_data)


# -------------------- PUT /products/update_optional/{product_id} --------------------
# Часткове оновлення продукту
@router.put(
    "/update_optional/{product_id}",
    response_model=UpdateProductResponse,
    summary="Partially update product",
    description="Partially updates the product by ID. Only provided fields will be updated.",
    responses={
        200: {
            "description": "Product successfully partially updated",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "updated_fields": ["nutrition_per_100g.protein"],
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
            "description": "Unauthorized",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        404: {
            "description": "Product not found",
            "content": {"application/json": {"example": {"detail": "Product not found"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def update_product_partial(product_id: str, data: ProductUpdateSchemaOptional):
    return await update_product_optional(product_id, data)


# -------------------- GET /products/search --------------------
# Пошук продуктів для модального вікна редагування
@router.get(
    "/search",
    response_model=List[ProductSearchResponseSchema],
    summary="Search products",
    description="Search products by name with partial match.",
)
async def search_products(q: str = Query(..., min_length=1, description="Search query")):
    return await search_products_by_name(q)


# -------------------- GET /products/{product_id} --------------------
# Отримати продукт за ID
@router.get(
    "/{product_id}",
    response_model=ProductResponseSchema,
    summary="Get product by ID",
    description="Returns product details including nutritional values.",
    responses={
        200: {
            "description": "Product retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "name": "Oat flakes",
                        "category": "Grains",
                        "nutrition_per_100g": {
                            "calories": 389,
                            "protein": 13,
                            "fat": 7,
                            "carbs": 66,
                        },
                        "created_at": "2026-03-02T10:00:00Z",
                        "updated_at": "2026-03-02T10:00:00Z",
                    }
                }
            },
        },
        400: {
            "description": "Invalid ID format",
            "content": {"application/json": {"example": {"detail": "Invalid product ID"}}},
        },
        401: {
            "description": "Unauthorized",
            "content": {"application/json": {"example": {"detail": "Not authenticated"}}},
        },
        404: {
            "description": "Product not found",
            "content": {"application/json": {"example": {"detail": "Product not found"}}},
        },
        500: {
            "description": "Internal server error",
            "content": {"application/json": {"example": {"detail": "Internal server error"}}},
        },
    },
)
async def get_product_by_id(product_id: str):
    return await get_product(product_id)
