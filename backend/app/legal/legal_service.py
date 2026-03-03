from datetime import datetime

from app.database import db


def anonymize_ip(ip: str) -> str:
    if not ip:
        return "0.0.0.0"
    parts = ip.split(".")
    if len(parts) == 4:
        parts[-1] = "0"
        return ".".join(parts)
    return "anonymized"


async def get_active_document_status():
    cursor = db.legal_documents.find({"is_active": True})
    documents = await cursor.to_list(length=10)
    return {doc["document_type"]: doc["version"] for doc in documents}


async def save_user_consent(user_id: str, doc_type: str, version: str, ip_address: str):
    anonymized_ip = anonymize_ip(ip_address)

    consent_record = {
        "user_id": user_id,
        "document_type": doc_type,
        "version": version,
        "ip_address": anonymized_ip,
        "consented_at": datetime.utcnow(),
    }
    await db.user_consents.insert_one(consent_record)

    await db.users.update_one({"user_id": user_id}, {"$set": {f"legal_status.{doc_type}": version}})


async def get_document_by_type(doc_type: str):
    doc = await db.legal_documents.find_one({"document_type": doc_type, "is_active": True})

    if doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc
