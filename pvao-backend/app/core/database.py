from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.DATABASE_NAME]
    
    # Initialize Beanie with models here
    # Example: await init_beanie(database, document_models=[MyModel])
    await init_beanie(database, document_models=[])
    
    print(f"Connected to MongoDB: {settings.DATABASE_NAME}")
