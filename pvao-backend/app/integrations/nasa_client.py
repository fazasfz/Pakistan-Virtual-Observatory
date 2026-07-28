import httpx
from app.core.config import settings

class NASAClient:
    BASE_URL = "https://api.nasa.gov/planetary/apod"

    async def get_apod(self) -> dict:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.BASE_URL,
                params={"api_key": settings.NASA_API_KEY}
            )
            response.raise_for_status()
            return response.json()

nasa_client = NASAClient()
