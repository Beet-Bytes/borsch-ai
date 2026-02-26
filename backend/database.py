import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

client = AsyncIOMotorClient(DATABASE_URL)

db = client["ai-borsch"]
