from flask import Blueprint, jsonify, request
import json
import random
from datetime import datetime, timedelta

api_bp = Blueprint('api', __name__)

@api_bp.route('/japan-coordinates')
def japan_coordinates():
    """Return Japan geographical coordinates for globe visualization"""
    return jsonify({
        "country": "Japan",
        "coordinates": {"lat": 36.2048, "lng": 138.2529},
        "regions": [
            {"name": "Hokkaido", "lat": 43.2203, "lng": 142.8635},
            {"name": "Honshu", "lat": 36.2048, "lng": 138.2529},
            {"name": "Kyushu", "lat": 31.7917, "lng": 130.7633},
            {"name": "Shikoku", "lat": 33.7838, "lng": 133.6585}
        ],
        "sar_active_zones": [
            {"name": "Tokyo Bay", "lat": 35.5494, "lng": 139.7798, "activity": 0.95},
            {"name": "Osaka Bay", "lat": 34.6197, "lng": 135.4305, "activity": 0.87},
            {"name": "Sendai Plains", "lat": 38.2682, "lng": 140.8694, "activity": 0.72}
        ]
    })

@api_bp.route('/sar-data')
def sar_data():
    """Return simulated SAR data for visualization"""
    sar_points = []
    base_coords = [
        (35.6762, 139.6503),  # Tokyo
        (34.6937, 135.5023),  # Osaka  
        (35.0116, 135.7681),  # Kyoto
        (36.2048, 138.2529),  # Central Japan
        (43.0642, 141.3469),  # Sapporo
    ]
    
    for i, (lat, lng) in enumerate(base_coords):
        for j in range(5):
            sar_points.append({
                "id": f"sar_{i}_{j}",
                "lat": lat + random.uniform(-0.5, 0.5),
                "lng": lng + random.uniform(-0.5, 0.5),
                "intensity": random.uniform(0.3, 1.0),
                "frequency": random.choice(["L-band", "C-band", "X-band"]),
                "polarization": random.choice(["HH", "HV", "VV", "VH"]),
                "timestamp": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
                "surface_type": random.choice(["urban", "forest", "water", "agriculture", "mountain"])
            })
    
    return jsonify({
        "total_points": len(sar_points),
        "data": sar_points,
        "metadata": {
            "collection_period": "2024-09-01 to 2024-10-01",
            "satellite_source": "Synthetic Aperture Radar Network", 
            "coverage_area": "Japan Archipelago"
        }
    })
