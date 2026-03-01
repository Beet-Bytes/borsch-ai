const API = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail ?? data.message ?? 'Something went wrong');
  }

  return data as T;
}

export async function register(email: string, password: string, agreed_to_terms: boolean) {
  return request<{ message: string; user_id: string }>('/auth/register', {
    email,
    password,
    agreed_to_terms,
  });
}

export async function confirmEmail(email: string, confirmation_code: string) {
  return request<{ status: string; message: string }>('/auth/confirm', {
    email,
    confirmation_code,
  });
}

export async function login(email: string, password: string) {
  return request<{
    access_token: string;
    id_token: string;
    refresh_token: string | null;
    token_type: string;
  }>('/auth/login', { email, password });
}
