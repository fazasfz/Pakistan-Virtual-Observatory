"""
Core business logic for the Deep Sky Explorer module.
Integrates with astroquery (NED and MAST) to fetch object classifications and imagery.
"""
from astroquery.ipac.ned import Ned
from astroquery.mast import Observations

def get_object_info(object_name: str):
    """
    Query NED for classification/metadata about a deep sky object.
    Returns a simplified dict, or an error message if not found.
    """
    try:
        result_table = Ned.query_object(object_name)
        row = result_table[0]
        return {
            "name": object_name,
            "type": row["Type"],
            "ra": float(row["RA"]),
            "dec": float(row["DEC"]),
            "redshift": float(row["Redshift"]) if row["Redshift"] else None,
        }
    except Exception as e:
        return {"error": f"Could not find object '{object_name}' in NED: {str(e)}"}


def get_object_images(object_name: str, limit: int = 3):
    """
    Query MAST for available observations/images of a deep sky object.
    Returns a simplified list of results.
    """
    try:
        obs_table = Observations.query_object(object_name)
        results = []
        for row in obs_table[:limit]:
            results.append({
                "mission": row["obs_collection"],
                "instrument": row["instrument_name"],
                "target": row["target_name"],
            })
        return results
    except Exception as e:
        return {"error": f"Could not find MAST data for '{object_name}': {str(e)}"}