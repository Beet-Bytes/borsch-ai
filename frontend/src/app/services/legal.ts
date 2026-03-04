const API = process.env.NEXT_PUBLIC_API_URL;

export interface LegalDocument {
  document_type: string;
  version: string;
  content: string;
}

export interface LegalStatus {
  [docType: string]: string;
}

export async function getLegalDocument(docType: string): Promise<LegalDocument> {
  const res = await fetch(`${API}/api/legal/document/${docType}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Failed to load document');
  return data as LegalDocument;
}

export async function getLegalStatus(): Promise<LegalStatus> {
  const res = await fetch(`${API}/api/legal/status`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Failed to load status');
  return data as LegalStatus;
}

export async function postConsent(documentType: string, version: string): Promise<void> {
  const res = await fetch(`${API}/api/legal/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ document_type: documentType, version }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? 'Failed to save consent');
}
