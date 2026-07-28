# backend/app/db.py
from pymongo import AsyncMongoClient
from beanie import init_beanie
from app.core.config import settings

async def init_db():
    client = AsyncMongoClient(settings.MONGO_URL)
    await init_beanie(database=client.pvao, document_models=[])