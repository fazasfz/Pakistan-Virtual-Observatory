from app.integrations.nasa_client import nasa_client

class SkyPortalService:
    async def get_todays_sky_image(self) -> dict:
        # Business logic goes here (e.g., transforming the APOD response)
        data = await nasa_client.get_apod()
        return {
            "title": data.get("title"),
            "url": data.get("url"),
            "explanation": data.get("explanation"),
            "date": data.get("date")
        }

sky_portal_service = SkyPortalService()
