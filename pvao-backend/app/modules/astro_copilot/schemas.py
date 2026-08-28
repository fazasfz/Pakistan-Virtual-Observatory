from pydantic import BaseModel, Field
from typing import Optional

class QueryRequest(BaseModel):
    query: str = Field(..., description="User query or astronomical term")
    source: Optional[str] = Field(
        default=None,
        description="Source platform or module identifier (e.g., Exora, Zenith, main_vao)",
    )
