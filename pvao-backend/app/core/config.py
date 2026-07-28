from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "PVAO Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB Config
    MONGODB_URL: str = "mongodb://localhost:27017" # Replace with Atlas URI in .env
    DATABASE_NAME: str = "pvao_db"
    
    # External API Keys
    NASA_API_KEY: str = "DEMO_KEY"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
