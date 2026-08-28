import logging
from typing import AsyncGenerator
from google import genai
from google.genai import errors, types
from groq import Groq, GroqError

from app.core.config import settings
from .db_service import save_to_cache

logger = logging.getLogger(__name__)

client: genai.Client | None = None
groq_client: Groq | None = None

SYSTEM_INSTRUCTION: str = (
    "You are AstroCopilot, an expert AI assistant strictly constrained to astronomy, astrophysics, "
    "cosmology, planetary science, and space exploration. "
    "Only answer questions within these domains. If a user asks a question outside of astronomy "
    "and space science, politely decline and state that you only answer astronomy-related queries."
)


def get_gemini_client() -> genai.Client:
    global client
    if client is None:
        key = settings.GEMINI_API_KEY
        if not key or key == "your_gemini_api_key_here":
            raise ValueError("GEMINI_API_KEY is not configured.")
        client = genai.Client(api_key=key)
    return client


def get_groq_client() -> Groq:
    global groq_client
    if groq_client is None:
        key = settings.GROQ_API_KEY
        if not key or key == "your_key_here":
            raise ValueError("GROQ_API_KEY is not configured.")
        groq_client = Groq(api_key=key)
    return groq_client


async def stream_gemini_response(user_query: str, local_context: str | None = None) -> AsyncGenerator[str, None]:
    """Streams the Gemini response asynchronously with fallback."""
    prompt = user_query
    if local_context:
        prompt = f"Website Reference Data: {local_context}\n\nUser Question: {user_query}\n\nVerify the reference data and expand."

    full_text = ""
    try:
        gemini_client = get_gemini_client()
        response_stream = await gemini_client.aio.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"system_instruction": SYSTEM_INSTRUCTION},
        )

        async for chunk in response_stream:
            if chunk.text:
                yield chunk.text
                full_text += chunk.text

        if full_text.strip():
            await save_to_cache(user_query, full_text)

    except Exception as e:
        logger.warning("Gemini streaming error, falling back to Groq: %s", e)
        fallback_res = query_groq_fallback(user_query, local_context)
        yield fallback_res
        if fallback_res.strip():
            await save_to_cache(user_query, fallback_res)


def query_groq_fallback(
    user_query: str,
    local_context: str | None = None,
    model: str = "llama-3.3-70b-versatile",
) -> str:
    """Queries the Groq fallback model."""
    try:
        client_instance = get_groq_client()
        user_content = (
            f"Local Knowledge Context:\n{local_context}\n\nUser Query:\n{user_query}"
            if local_context
            else user_query
        )

        messages = [
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "user", "content": user_content},
        ]

        chat_completion = client_instance.chat.completions.create(
            messages=messages,
            model=model,
            temperature=0.3,
        )

        if chat_completion.choices and chat_completion.choices[0].message.content:
            return chat_completion.choices[0].message.content
        return "No response generated from Groq API."

    except Exception as exc:
        logger.error("Error during Groq fallback query: %s", exc)
        return f"AstroCopilot is currently unavailable. Error: {str(exc)}"
