const API = process.env.NEXT_PUBLIC_API_URL;

export interface MissingDoc {
  type: string;
  required_version: string;
  user_version: string;
}

export class ConsentRequiredError extends Error {
  constructor(public missing: MissingDoc[]) {
    super('LEGAL_CONSENT_REQUIRED');
    this.name = 'ConsentRequiredError';
  }
}

// Registered by ConsentProvider — resolves when user has accepted consent
type ConsentHandler = (missing: MissingDoc[]) => Promise<void>;
let consentHandler: ConsentHandler | null = null;

export function registerConsentHandler(handler: ConsentHandler) {
  consentHandler = handler;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API}${path}`, { credentials: 'include', ...init });

  if (res.status === 451) {
    const data = await res.clone().json();
    const detail = data?.detail;

    if (detail?.error_code === 'LEGAL_CONSENT_REQUIRED') {
      if (consentHandler) {
        await consentHandler(detail.missing_or_outdated ?? []);
        // Retry original request after consent
        return apiFetch(path, init);
      }
      throw new ConsentRequiredError(detail.missing_or_outdated ?? []);
    }
  }

  return res;
}
