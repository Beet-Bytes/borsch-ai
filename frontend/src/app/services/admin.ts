const API = process.env.NEXT_PUBLIC_API_URL;
import { request } from './auth';

// --- ПРОДУКТИ ---
export interface CreateProductPayload {
  name: string;
  category: string;
  default_unit: string;
  nutrition_per_100g: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export async function createProductApi(payload: CreateProductPayload) {
  return request<{ message: string; id: string }>('/products/create', payload);
}

// --- РЕЦЕПТИ (ОНОВЛЕНО) ---
export interface RecipeIngredient {
  _id: string; // Тільки ID продукту з бази
  quantity: number; // Кількість (без unit)
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
}

export interface CreateRecipePayload {
  name: string;
  goal: string;
  cooking_time: number;
  difficulty: string;
  number_of_servings: number;
  utensils: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  total_nutrition_per_serving: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export async function createRecipeApi(payload: CreateRecipePayload) {
  // Використовуємо твій auth request
  return request<any>('/recipes/create', payload);
}

export async function checkAdminStatus() {
  const res = await fetch(`${API}/users/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Not authorized');
  }

  return res.json();
}
