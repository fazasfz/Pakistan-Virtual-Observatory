"""
Pydantic data models for the Astro-Copilot module.
Defines schemas for chat messages, incoming questions, and LLM responses.
"""
from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str
    text: str

class AskRequest(BaseModel):
    question: str
    history: Optional[List[Message]] = None

class AskResponse(BaseModel):
    answer: str
    limited: bool = False
