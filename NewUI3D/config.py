import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'meta-verse-sar-2024'
    DEBUG = True
    
    NASA_API_KEY = os.environ.get('NASA_API_KEY')
    ESA_API_KEY = os.environ.get('ESA_API_KEY')
    
    GLOBE_TEXTURE_URL = '/static/images/earth-texture.jpg'
    JAPAN_COORDINATES = {
        'lat': 36.2048,
        'lng': 138.2529,
        'zoom': 5.5
    }
