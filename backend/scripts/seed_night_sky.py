import sys
import os
import asyncio
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app.models.astro_object import AstroObject

objects = [
    {
        "object_id": "moon", "name": "Moon", "category": "moon",
        "description": "The Moon doesn't make its own light — we're seeing sunlight bounce off it, and its changing phase over about 29.5 days comes from Earth, Moon, and Sun shifting position relative to each other. It's also the natural entry point for tides, eclipses, and how ancient calendars were built.",
        "pakistan_note": "Moon phase has real cultural weight here — the sighting of the crescent (Chand) determines Islamic calendar dates like Eid and Ramadan. SUPARCO runs a formal lunar prediction program feeding the Ruet-e-Hilal Committee; flagging an upcoming New Moon as a possible Chand Raat window is a nice local touch.",
        "timing_rule": {"type": "ephemeris"},
    },
    {
        "object_id": "venus", "name": "Venus", "category": "planet",
        "description": "The brightest planet in the sky by far — brighter than any star — because it's close to both the Sun and Earth, and its thick cloud cover reflects sunlight efficiently. Often mistaken for a plane or UFO since it doesn't twinkle. Only ever visible near sunrise or sunset.",
        "pakistan_note": "Bright enough to be genuinely visible even from light-polluted cities like Lahore or Karachi — a great 'look up right now and you'll actually see it' object.",
        "timing_rule": {"type": "ephemeris"},
    },
    {
        "object_id": "mars", "name": "Mars", "category": "planet",
        "description": "The reddish 'wandering star' that's fascinated stargazers for thousands of years — its color comes from iron oxide covering its surface. Most associated with the search for life beyond Earth. Best viewing is around opposition, roughly every 26 months.",
        "pakistan_note": "Bright enough to see from most Pakistani cities near opposition, no special local factor beyond general sky darkness.",
        "timing_rule": {"type": "ephemeris"},
    },
    {
        "object_id": "jupiter", "name": "Jupiter", "category": "planet",
        "description": "The largest planet in the solar system — a great 'wow' object even with basic binoculars, showing as a small disc, sometimes with its four biggest moons lined up beside it, first noticed by Galileo in 1610. Second-brightest planet after Venus.",
        "pakistan_note": "A good general 'point your phone or binoculars here' object regardless of city.",
        "timing_rule": {"type": "ephemeris"},
    },
    {
        "object_id": "saturn", "name": "Saturn", "category": "planet",
        "description": "The ringed planet — honestly the single best 'convert someone into a space fan' object. The rings are ice and rock, tilting through different angles over a roughly 29-year cycle, so how 'open' they look changes year to year. A basic telescope, not binoculars, is needed to resolve them.",
        "pakistan_note": "No specific local factor — general sky darkness applies.",
        "timing_rule": {"type": "ephemeris"},
    },
    {
        "object_id": "mercury", "name": "Mercury", "category": "planet",
        "description": "The trickiest naked-eye planet to spot — it stays close to the Sun, only poking above the horizon briefly around sunrise or sunset. Closest planet to the Sun, almost no atmosphere, surface covered in craters like the Moon's.",
        "pakistan_note": "Needs a clean horizon view, which is genuinely harder in cities with lots of buildings or haze like Lahore or Karachi — a rooftop or open field helps a lot.",
        "timing_rule": {"type": "ephemeris"},
    },
    {
        "object_id": "iss", "name": "International Space Station (ISS)", "category": "satellite",
        "description": "A football-field-sized space station orbiting about 400 km up, with astronauts living aboard right now. No equipment needed — it looks like a very bright, fast-moving, steady light crossing the sky in a few minutes.",
        "pakistan_note": "Pass times are location-specific — a planner calculating passes separately for Islamabad, Karachi, and Lahore is genuinely more useful than one generic time.",
        "timing_rule": {"type": "static"},
    },
    {
        "object_id": "perseids", "name": "Perseid Meteor Shower", "category": "meteor_shower",
        "description": "Earth passing through dust left behind by comet 109P/Swift-Tuttle; the particles burn up in our atmosphere as shooting stars. The most popular shower of the year — reliable, relatively strong, and during warm summer nights.",
        "pakistan_note": "The mid-August peak means competing with monsoon cloud cover in much of the country — viewing odds are genuinely weather-dependent this time of year.",
        "timing_rule": {"type": "date_range", "start": "07-17", "end": "08-24"},
    },
    {
        "object_id": "geminids", "name": "Geminid Meteor Shower", "category": "meteor_shower",
        "description": "Often called the best meteor shower of the year — more meteors per hour than the Perseids, bright and slow-moving. Unusually comes from asteroid 3200 Phaethon rather than a comet.",
        "pakistan_note": "The December peak lines up with Pakistan's driest, clearest skies, post-monsoon and pre-spring haze — one of the best real viewing opportunities in the local calendar.",
        "timing_rule": {"type": "date_range", "start": "12-04", "end": "12-17"},
    },
    {
        "object_id": "orion", "name": "Orion", "category": "constellation",
        "description": "Usually the first constellation people learn to recognize, thanks to the three bright stars in Orion's Belt. Contains a bonus object — the Orion Nebula, a stellar nursery visible as a fuzzy patch to the naked eye under decent skies.",
        "pakistan_note": "A good winter anchor constellation for the app's seasonal sky map, no special local factor.",
        "timing_rule": {"type": "seasonal", "best_months": [12, 1, 2, 3]},
    },
    {
        "object_id": "ursa_major", "name": "Ursa Major (Big Dipper / Saptarishi)", "category": "constellation",
        "description": "The pot-shaped group of seven bright stars everyone half-knows as the Big Dipper. The two stars at the end of the 'bowl' point almost directly to Polaris, the North Star — often the first constellation taught for navigation.",
        "pakistan_note": "The name Saptarishi (Seven Sages) has deep roots in South Asian astronomical tradition — worth using both names in the app.",
        "timing_rule": {"type": "seasonal", "best_months": [3, 4, 5]},
    },
    {
        "object_id": "scorpius", "name": "Scorpius", "category": "constellation",
        "description": "One of the few constellations that genuinely looks like what it's named after — a curving tail ending in a stinger. Its brightest star, Antares, is a red supergiant so large it would reach past Mars if it replaced our Sun.",
        "pakistan_note": "Stays low on the southern horizon here, so a clear view south, away from city glow, matters more than for constellations higher overhead.",
        "timing_rule": {"type": "seasonal", "best_months": [6, 7, 8]},
    },
    {
        "object_id": "milky_way_core", "name": "Milky Way (galactic core)", "category": "constellation",
        "description": "Most people in cities have never seen the Milky Way, because light pollution washes it out. Under a genuinely dark sky, it appears as a hazy band — the combined glow of hundreds of billions of stars in our own galaxy's disc, seen edge-on from inside it.",
        "pakistan_note": "Places like Skardu, Deosai, or Hunza have some of the darkest skies in the region — pairing this content with a light-pollution overlay could be a real differentiator.",
        "timing_rule": {"type": "seasonal", "best_months": [5, 6, 7, 8]},
    }
]

async def main():
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
    
    # Try importing init_db if available, else connect directly
    try:
        from app.db import init_db
        await init_db()
    except ImportError:
        mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
        # Patch for Beanie / Motor compatibility bug
        import motor.core
        motor.core.AgnosticClient.append_metadata = lambda *args, **kwargs: None
        client = AsyncIOMotorClient(mongo_url)

        # Handle get_default_database error if connection string has no DB
        try:
            db = client.get_default_database()
        except Exception:
            db = client["ncgsa_observatory"]
        await init_beanie(database=db, document_models=[AstroObject])

    await AstroObject.find_all().delete()
    docs = [AstroObject(**obj) for obj in objects]
    await AstroObject.insert_many(docs)
    print(f"Successfully inserted {len(docs)} AstroObject documents.")

if __name__ == "__main__":
    asyncio.run(main())
