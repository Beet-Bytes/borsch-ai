from pydantic import BaseModel, EmailStr


# -------------------- Запит на реєстрацію користувача --------------------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    agreed_to_terms: bool


# -------------------- Запит на підтвердження реєстрації --------------------
class ConfirmRequest(BaseModel):
    email: EmailStr
    confirmation_code: str


# -------------------- Запит на вхід користувача --------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
