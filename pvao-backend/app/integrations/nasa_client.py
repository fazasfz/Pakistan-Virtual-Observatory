"""
Integration client for the NASA APOD (Astronomy Picture of the Day) API.
Provides utility methods to fetch the latest space imagery.
"""
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
            try:
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                print(f"NASA API Error: {e}")
                return {
                    "title": "The Pillars of Creation (M16)",
                    "url": "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg",
                    "hdurl": "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg",
                    "explanation": "Towering celestial tendrils of interstellar gas and dust stand inside the Eagle Nebula (M16). Star formation unfolds within these dense columns where newborn stars sculpt the surrounding landscape with intense stellar radiation.",
                    "date": "Featured Cosmic Observation"
                }

nasa_client = NASAClient()
