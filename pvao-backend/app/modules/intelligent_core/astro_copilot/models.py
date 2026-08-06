from beanie import Document
from datetime import date

class UsageLog(Document):
    day: date
    request_count: int = 0

    class Settings:
        name = "astro_copilot_usage"
