const API = process.env.NEXT_PUBLIC_API_URL;

export interface DetectedIngredient {
  ingredient: string;
  confidence: number;
  quantity?: number;
  unit?: string;
}

export interface AIAnalyzeResponse {
  status: string;
  total_detected: number;
  ingredients: DetectedIngredient[];
  image_base64?: string;
}

export async function analyzeFridgeImage(imageFile: File): Promise<AIAnalyzeResponse> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const res = await fetch(`${API}/fridge/scan`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail ?? data.message ?? 'Image analysis failed');
  }

  return data as AIAnalyzeResponse;
}

// Створимо строгий тип для фінальних інгредієнтів (без unit!)
export interface RecipeIngredientPayload {
  name: string;
  quantity: number;
  unit: string;
}

export async function generateRecipesApi(
  imageFile: File,
  originalIngredients: string[],
  finalIngredients: RecipeIngredientPayload[]
) {
  const formData = new FormData();

  formData.append('file', imageFile);
  formData.append('original_items', JSON.stringify(originalIngredients));
  formData.append('final_items', JSON.stringify(finalIngredients));

  const res = await fetch(`${API}/fridge/generate`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail ?? data.message ?? 'Failed to generate recipes');
  }

  return data;
}
