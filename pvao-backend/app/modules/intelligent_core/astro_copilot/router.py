from fastapi import APIRouter
from .schemas import AskRequest, AskResponse
from .service import ask_astro_copilot

router = APIRouter(prefix="/astro-copilot", tags=["Astro-Copilot"])

@router.post("/ask", response_model=AskResponse)
async def ask(payload: AskRequest):
    return await ask_astro_copilot(payload.question)
