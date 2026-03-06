from typing import Optional

from pydantic import BaseModel, Field


class AICorrectionSchema(BaseModel):
    scan_id: str = Field(..., description="file_key image in S3")
    original_item: Optional[str] = Field(None, description="What AI said (None, if user adds new)")
    corrected_item: Optional[str] = Field(..., description="Correct name from user")
    confidence: Optional[float] = Field(None, description="AI confidence in the false option")
