import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.core.database import init_db
from app.api_router import api_router
from app.modules.astro_copilot.router import ask_astrocopilot, QueryRequest

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Unified Backend API and Static Host for the Virtual Astronomy Observatory",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()

# Central v1 API routes (/api/v1/...)
app.include_router(api_router, prefix="/api/v1")

# Direct AstroCopilot Ask Endpoint (/api/ask) for direct compatibility
@app.post("/api/ask", tags=["AstroCopilot"])
async def direct_ask_astrocopilot(payload: QueryRequest):
    return await ask_astrocopilot(payload)

@app.get("/api/health")
def health_check():
    return {"status": "online", "project": settings.PROJECT_NAME, "version": settings.VERSION}

# Locate static frontend build directory
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../pvao-frontend/dist"))

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        # Allow API calls and docs to pass through
        if full_path.startswith("api/") or full_path in ["docs", "redoc", "openapi.json"]:
            return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
        
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "message": "Welcome to VAO API. Status: ONLINE",
            "docs": "/docs",
            "info": "Frontend dist not detected. Run 'npm run build' in pvao-frontend to serve UI from FastAPI."
        }