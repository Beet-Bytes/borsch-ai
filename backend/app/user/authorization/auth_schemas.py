from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    agreed_to_terms: bool


class ConfirmRequest(BaseModel):
    email: EmailStr
    confirmation_code: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
