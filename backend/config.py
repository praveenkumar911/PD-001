import os
from dotenv import dotenv_values, load_dotenv,find_dotenv
load_dotenv(find_dotenv())
MONGO_ENDPOINT = os.environ.get("MONGO_ENDPOINT")
# MONGO_ENDPOINT = os.getenv('MONGO_ENDPOINT')
MONGO_USERNAME = os.getenv('MONGO_USERNAME')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'AA_ASR')
MINIO_ACCESS_KEY =os.getenv('MINIO_ACCESS_KEY')  
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_ENDPOINT=os.getenv('MINIO_ENDPOINT')
LEN_AUDIO_URL = 0
