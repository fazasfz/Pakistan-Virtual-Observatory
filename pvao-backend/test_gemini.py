import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
import httpx

async def test():
    key = os.getenv('GEMINI_API_KEY')
    print('Key:', key[:10] + '...')
    async with httpx.AsyncClient() as client:
        res = await client.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' + key,
            json={
                "contents": [{"parts": [{"text": "hi"}]}],
                "systemInstruction": {"parts": [{"text": "You are a bot"}]}
            }
        )
        print(res.status_code, res.text)

asyncio.run(test())
