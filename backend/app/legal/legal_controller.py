from app.legal import legal_service as service
from app.legal.legal_schemas import ConsentRequestSchema
from app.user.authorization.auth_middleware import get_current_user
from fastapi import APIRouter, Depends, Request

router = APIRouter(prefix="/api/legal", tags=["Legal"])


@router.get("/status")
async def get_legal_status():
    return await service.get_active_document_status()


@router.post("/consent")
async def post_user_consent(
    data: ConsentRequestSchema, request: Request, user_id: str = Depends(get_current_user)
):
    client_ip = request.client.host
    await service.save_user_consent(user_id, data.document_type, data.version, client_ip)
    return {"status": "accepted"}
