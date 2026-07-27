from typing import Literal
from beanie import Document

class AstroObject(Document):
    object_id: str
    name: str
    category: Literal["planet", "moon", "constellation", "meteor_shower", "satellite"]
    description: str
    pakistan_note: str
    timing_rule: dict

    class Settings:
        name = "astro_objects"
