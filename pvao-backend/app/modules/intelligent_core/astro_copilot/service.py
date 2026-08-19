"""
Core business logic for the Astro-Copilot intelligent assistant.
Enforces daily usage caps via MongoDB and routes valid questions to the Gemini client.
"""
from datetime import date
from .models import UsageLog
from .schemas import AskResponse
from app.core.config import settings
from app.integrations.gemini_client import ask_gemini

async def ask_astro_copilot(question: str, history: list = None) -> AskResponse:
    today_str = date.today().isoformat()
    
    # Get or create today's usage log
    usage_log = await UsageLog.find_one({"day": today_str})
    if not usage_log:
        usage_log = UsageLog(day=today_str, request_count=0)
        await usage_log.insert()

    # Check daily limit
    if usage_log.request_count >= settings.DAILY_LIMIT:
        return AskResponse(
            answer="I've reached my usage limit for today — please try again tomorrow.",
            limited=True
        )

    # Increment usage count immediately to prevent race conditions on the limit
    usage_log.request_count += 1
    await usage_log.save()

    try:
        answer = await ask_gemini(question, history)
        return AskResponse(answer=answer, limited=False)
    except Exception as e:
        # Graceful fallback, log the error in a real app
        print(f"Gemini API Error: {e}")
        return AskResponse(
            answer="Astro-Copilot is temporarily unavailable, please try again shortly.",
            limited=False
        )
