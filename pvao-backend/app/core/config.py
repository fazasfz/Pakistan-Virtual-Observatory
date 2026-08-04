from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "PVAO Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB Config
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "pvao_db"
    
    # External API Keys
    NASA_API_KEY: str = "DEMO_KEY"
    GEMINI_API_KEY: Optional[str] = None
    
    # Feature Configs
    DAILY_LIMIT: int = 150

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
