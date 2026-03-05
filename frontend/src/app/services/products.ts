const API = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  id: string;
  name: string;
  category: string;
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];

  const res = await fetch(`${API}/products/search?q=${encodeURIComponent(query)}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch products');

  return res.json();
}
