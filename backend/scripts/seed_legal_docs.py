"""
Seed legal documents from docs/ HTML files into MongoDB.

Run from the project root (where .env is):
    python backend/scripts/seed_legal_docs.py
"""

import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# .env is in the project root (two levels up from this script)
ROOT = Path(__file__).parent.parent.parent
load_dotenv(ROOT / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set. Make sure .env exists in the project root.")

client = AsyncIOMotorClient(DATABASE_URL)
db = client["ai-borsch"]

DOCS_DIR = ROOT / "docs"

DOCUMENTS = [
    {"document_type": "privacy_policy", "file": "Privacy Policy.html", "version": "1.0"},
    {"document_type": "terms_of_service", "file": "Terms of Service.html", "version": "1.0"},
    {"document_type": "eula", "file": "EULA.html", "version": "1.0"},
    {"document_type": "disclaimer", "file": "Disclaimer.html", "version": "1.0"},
]


async def seed():
    for doc in DOCUMENTS:
        file_path = DOCS_DIR / doc["file"]
        if not file_path.exists():
            print(f"  SKIP  {doc['document_type']} — file not found: {file_path}")
            continue

        content = file_path.read_text(encoding="utf-8")

        await db.legal_documents.update_one(
            {"document_type": doc["document_type"]},
            {
                "$set": {
                    "document_type": doc["document_type"],
                    "version": doc["version"],
                    "content": content,
                    "is_active": True,
                }
            },
            upsert=True,
        )
        print(f"  OK    {doc['document_type']} (v{doc['version']})")

    client.close()


if __name__ == "__main__":
    print(f"Seeding from: {DOCS_DIR}\n")
    asyncio.run(seed())
    print("\nDone.")
