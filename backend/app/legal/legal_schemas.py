from typing import Dict

from pydantic import BaseModel


class LegalDocumentResponseSchema(BaseModel):
    document_type: str
    version: str
    content: str


class LegalStatusResponseSchema(BaseModel):
    versions: Dict[str, str]


class ConsentRequestSchema(BaseModel):
    document_type: str
    version: str
