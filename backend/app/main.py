from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import motor.core
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from .models.astro_object import AstroObject
from .api.night_sky import router as night_sky_router

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Patch for Beanie / Motor compatibility bug
    motor.core.AgnosticClient.append_metadata = lambda *args, **kwargs: None
    
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    
    # Configure client with certifi SSL certificates
    client_kwargs = {}
    if mongo_url.startswith("mongodb+srv://") or "mongodb.net" in mongo_url:
        client_kwargs["tlsCAFile"] = certifi.where()

    client = AsyncIOMotorClient(mongo_url, **client_kwargs)
    try:
        db = client.get_default_database()
    except Exception:
        db = client["ncgsa_observatory"]
        
    await init_beanie(database=db, document_models=[AstroObject])
    yield
    client.close()

app = FastAPI(title="NCGSA Virtual Observatory API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(night_sky_router)

@app.get("/")
def root():
    return {"message": "Virtual Observatory API is running"}