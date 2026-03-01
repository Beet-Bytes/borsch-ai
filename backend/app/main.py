from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.fridge.fridge_controller import router as fridge_router
from app.user.authorization.auth_controller import router as auth_router
from app.user.photos_uploader.upload_controller import router as upload_router
from app.user.profile.profile_controller import router as profile_router

app = FastAPI(title="AI Borsch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # TODO: when set product in production set our domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Borsch AI Backend is running!", "status": "active"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(upload_router)
app.include_router(fridge_router)
