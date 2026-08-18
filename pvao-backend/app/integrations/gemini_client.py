"""
Integration client for the Google Gemini LLM API.
Used by the Astro-Copilot service to generate astronomy-related answers based on a system prompt.
"""
import httpx
from app.core.config import settings

SYSTEM_PROMPT = (
    "You are Astro-Copilot, an assistant for the Virtual Astronomy Observatory (VAO), "
    "an educational astronomy platform. Only answer questions about astronomy, space, "
    "astrophysics, telescopes, and this platform's modules. If a question is unrelated "
    "to these topics, politely say you can only help with astronomy-related questions "
    "and cannot answer that. Keep answers concise and accurate."
)

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-3.5-flash:generateContent"
)

async def ask_gemini(question: str, history: list = None) -> str:
    contents = []
    
    if history:
        for msg in history:
            # Gemini roles are 'user' and 'model'
            role = "model" if msg.role == "ai" else "user"
            contents.append({
                "role": role,
                "parts": [{"text": msg.text}]
            })
            
    contents.append({
        "role": "user",
        "parts": [{"text": question}]
    })

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{GEMINI_URL}?key={settings.GEMINI_API_KEY}",
            json={
                "contents": contents,
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
