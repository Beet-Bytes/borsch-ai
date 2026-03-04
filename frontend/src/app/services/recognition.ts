const API = process.env.NEXT_PUBLIC_API_URL;

export interface DetectedIngredient {
  ingredient: string;
  confidence: number;
}

export interface AIAnalyzeResponse {
  status: string;
  total_detected: number;
  ingredients: DetectedIngredient[];
  image_base64: string;
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
