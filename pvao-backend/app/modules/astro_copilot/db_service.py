import logging
from datetime import datetime, timezone
from typing import Any
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger(__name__)

mongo_client: AsyncIOMotorClient | None = None
db: Any = None
query_cache_collection: Any = None


async def init_db() -> None:
    """Initializes the asynchronous MongoDB client and database handles for query cache."""
    global mongo_client, db, query_cache_collection
    if mongo_client is None:
        try:
            mongo_client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
            )
            db = mongo_client["astrocopilot"]
            query_cache_collection = db["query_cache"]
            logger.info("Connected to MongoDB for AstroCopilot at %s", settings.MONGODB_URI)
        except Exception as exc:
            logger.warning("Could not connect to MongoDB for AstroCopilot query cache: %s", exc)
            mongo_client = None
            db = None
            query_cache_collection = None


async def close_db() -> None:
    """Closes the MongoDB client connection."""
    global mongo_client, db, query_cache_collection
    if mongo_client is not None:
        try:
            mongo_client.close()
            logger.info("Closed AstroCopilot MongoDB client connection.")
        except Exception as exc:
            logger.error("Error closing MongoDB connection: %s", exc)
        finally:
            mongo_client = None
            db = None
            query_cache_collection = None


def normalize_query(query: str) -> str:
    """Normalizes the search query by stripping whitespace and converting to lowercase."""
    return query.strip().lower()


async def get_cached_answer(query: str) -> str | None:
    """Queries MongoDB for a cached answer matching the normalized query string."""
    if query_cache_collection is None:
        await init_db()

    if query_cache_collection is None or not query or not query.strip():
        return None

    normalized = normalize_query(query)

    try:
        doc = await query_cache_collection.find_one({"query": normalized})
        if doc and "answer" in doc:
            logger.info("MongoDB cache hit for query: '%s'", normalized)
            return str(doc["answer"])
    except Exception as exc:
        logger.warning("MongoDB lookup exception (proceeding with live LLM): %s", exc)

    return None


async def save_to_cache(query: str, answer: str) -> None:
    """Saves a query, its generated answer, and timestamp into MongoDB query_cache collection."""
    if query_cache_collection is None:
        await init_db()

    if query_cache_collection is None or not query or not query.strip() or not answer:
        return

    normalized = normalize_query(query)

    try:
        document = {
            "query": normalized,
            "answer": answer,
            "created_at": datetime.now(timezone.utc),
        }
        await query_cache_collection.insert_one(document)
        logger.info("Saved query to MongoDB cache: '%s'", normalized)
    except Exception as exc:
        logger.warning("MongoDB cache save exception: %s", exc)
