# backend/app/main.py
from fastapi import FastAPI
from app.db import init_db

app = FastAPI()

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/health")
def health():
    return {"status": "ok"}