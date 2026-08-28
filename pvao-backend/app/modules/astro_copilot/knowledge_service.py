import json
import logging
import re
from pathlib import Path

logger = logging.getLogger(__name__)

GLOSSARY_FILE_PATH = Path(__file__).resolve().parent / "data" / "glossary.json"

_glossary_cache = None


def load_glossary():
    """Loads and caches glossary.json from disk."""
    global _glossary_cache
    if _glossary_cache is None:
        if not GLOSSARY_FILE_PATH.exists():
            logger.warning("Glossary file not found at %s", GLOSSARY_FILE_PATH)
            _glossary_cache = []
            return _glossary_cache
        try:
            with open(GLOSSARY_FILE_PATH, "r", encoding="utf-8") as f:
                _glossary_cache = json.load(f)
        except Exception as exc:
            logger.error("Failed to load glossary.json: %s", exc)
            _glossary_cache = []
    return _glossary_cache


def _extract_search_keys(raw_name: str) -> list[str]:
    """Extracts base term and parenthetical aliases (e.g., 'Astronomical Unit (AU)' -> ['astronomical unit', 'au'])."""
    keys = []
    cleaned = raw_name.strip()
    if not cleaned:
        return keys

    match = re.match(r"^(.*?)\s*\((.*?)\)$", cleaned)
    if match:
        main_part = match.group(1).strip().lower()
        paren_part = match.group(2).strip().lower()
        if main_part:
            keys.append(main_part)
        if paren_part:
            keys.append(paren_part)
    else:
        keys.append(cleaned.lower())

    return keys


def search_local_knowledge(query: str) -> str | None:
    """Performs exact and word-boundary matching on local glossary."""
    glossary = load_glossary()
    if not glossary:
        return None

    normalized_query = query.strip().lower()

    def matches_term(key_name: str) -> bool:
        if not key_name:
            return False
        escaped_key = re.escape(key_name)
        pattern = rf"(^|[\W_]){escaped_key}([\W_]|$)"
        return bool(re.search(pattern, normalized_query))

    if isinstance(glossary, list):
        for category_block in glossary:
            if not isinstance(category_block, dict):
                continue
            terms = category_block.get("terms", [])
            for term_entry in terms:
                if not isinstance(term_entry, dict):
                    continue
                term_name = term_entry.get("name", "")
                description = term_entry.get("desc", "")

                search_keys = _extract_search_keys(term_name)
                search_keys.sort(key=len, reverse=True)
                for key in search_keys:
                    if matches_term(key):
                        return f"{term_name}: {description}"

    elif isinstance(glossary, dict):
        for key, data in glossary.items():
            search_keys = _extract_search_keys(key)
            search_keys.sort(key=len, reverse=True)
            for k in search_keys:
                if matches_term(k):
                    if isinstance(data, dict):
                        return data.get("definition") or data.get("desc")
                    elif isinstance(data, str):
                        return data

    return None
