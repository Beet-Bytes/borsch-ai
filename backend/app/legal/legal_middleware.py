from app.user.authorization.auth_middleware import get_current_user
from fastapi import Depends, HTTPException, status

from . import legal_service


async def verify_legal_consent(user_id: str = Depends(get_current_user)):
    missing_docs = await legal_service.check_legal_compliance(user_id)

    if missing_docs:
        raise HTTPException(
            status_code=status.HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS,
            detail={
                "error_code": "LEGAL_CONSENT_REQUIRED",
                "message": "Please accept the latest versions of legal documents.",
                "missing_or_outdated": missing_docs,
                "fetch_url": "api/legal/status",
            },
        )

    return user_id
