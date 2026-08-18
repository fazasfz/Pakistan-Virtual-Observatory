"""
MongoDB connection and initialization logic using Beanie and Motor.
Provides the init_db function called during application startup in main.py.
"""
from pymongo import AsyncMongoClient
from beanie import init_beanie
from app.core.config import settings
from app.modules.intelligent_core.astro_copilot.models import UsageLog

client = AsyncMongoClient(settings.MONGODB_URI)

async def init_db():
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[UsageLog],
    )
    
    print(f"Connected to MongoDB Atlas: {settings.DATABASE_NAME}")
