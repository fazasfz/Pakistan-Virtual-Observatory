from typing import AsyncGenerator
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from .schemas import QueryRequest
from .db_service import get_cached_answer
from .knowledge_service import search_local_knowledge
from .llm_service import stream_gemini_response

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "online", "module": "AstroCopilot"}


async def cached_text_generator(content: str) -> AsyncGenerator[str, None]:
    yield content


@router.post("/ask")
async def ask_astrocopilot(payload: QueryRequest) -> StreamingResponse:
    """Routes user queries through local JSON cache, MongoDB cache, and Streaming Gemini LLM."""
    user_query = payload.query.strip()

    # 1. Local Glossary Cache
    local_match = search_local_knowledge(user_query)
    if local_match:
        return StreamingResponse(
            cached_text_generator(local_match),
            media_type="text/event-stream",
        )

    # 2. MongoDB Database Cache
    cached_db_answer = await get_cached_answer(user_query)
    if cached_db_answer:
        return StreamingResponse(
            cached_text_generator(cached_db_answer),
            media_type="text/event-stream",
        )

    # 3. Live LLM streaming
    return StreamingResponse(
        stream_gemini_response(user_query=user_query),
        media_type="text/event-stream",
    )
