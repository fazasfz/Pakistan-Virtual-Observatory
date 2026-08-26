"""
Integration client for the NASA APOD (Astronomy Picture of the Day) API.
Provides utility methods to fetch the latest space imagery.
"""
import httpx
from app.core.config import settings

class NASAClient:
    BASE_URL = "https://api.nasa.gov/planetary/apod"

    async def get_apod(self) -> dict:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.get(
                    self.BASE_URL,
                    params={"api_key": settings.NASA_API_KEY}
                )
                response.raise_for_status()
                data = response.json()
                if "url" in data and "title" in data:
                    return data
        except Exception as e:
            print(f"NASA API Error / Fallback activated: {e}")

        return {
            "title": "The Pillars of Creation (M16)",
            "url": "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg",
            "hdurl": "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg",
            "explanation": "Towering celestial tendrils of interstellar gas and dust stand inside the Eagle Nebula (M16). Star formation unfolds within these dense columns where newborn stars sculpt the surrounding landscape with intense stellar radiation.",
            "date": "Featured Cosmic Observation",
            "media_type": "image"
        }

nasa_client = NASAClient()
