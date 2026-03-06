import { apiFetch } from './apiClient';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? data.message ?? 'Something went wrong');
  return data as T;
}

export interface ProfileData {
  email: string;
  role: string;
  profile: {
    first_name?: string;
    last_name?: string;
    birthDate?: string;
    avatar_url?: string;
    locale?: string;
    timezone?: string;
  };
  biometrics: {
    goal?: string;
    activityLevel?: string;
    gender?: string;
    height_cm?: number;
    weight_kg?: number;
    target_weight?: number;
  };
  hard_constraints: {
    diet?: string;
    allergies?: string[];
  };
}

export async function getProfile(): Promise<ProfileData> {
  return request<ProfileData>('/profile');
}

export async function updateProfile(data: {
  profile?: { first_name?: string; last_name?: string; birthDate?: string };
  biometrics?: {
    goal?: string;
    activityLevel?: string;
    gender?: string;
    height_cm?: number;
    weight_kg?: number;
    target_weight?: number;
  };
  hard_constraints?: { diet?: string; allergies?: string[] };
}): Promise<void> {
  return request('/profile/update_optional', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API}/profile/avatar`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? data.message ?? 'Upload failed');
  return data;
}
