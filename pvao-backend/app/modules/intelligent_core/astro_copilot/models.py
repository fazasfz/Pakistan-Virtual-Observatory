"""
Database models for the Astro-Copilot module using Beanie (MongoDB).
Defines the UsageLog collection to track daily API request counts.
"""
from beanie import Document
from datetime import date

class UsageLog(Document):
    day: str
    request_count: int = 0

    class Settings:
        name = "astro_copilot_usage"
