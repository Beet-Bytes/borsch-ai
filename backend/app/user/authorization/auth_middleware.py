import os

import jwt
import requests
from dotenv import load_dotenv
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.user.authorization.auth_service import AuthService

load_dotenv()

# -------------------- Конфігурація Cognito --------------------
COGNITO_REGION = os.getenv("AWS_REGION")
USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")

# Завантаження JWKS ключів
JWKS_URL = (
    f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"
)
ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"

try:
    jwks = requests.get(JWKS_URL).json()
except Exception as e:
    print(f"JWKS loading error: {e}")
    jwks = {"keys": []}

# -------------------- Security --------------------
security = HTTPBearer()
auth_service = AuthService()


# -------------------- Функція отримання поточного користувача --------------------
async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    token = credentials.credentials

    try:
        # Отримання заголовка JWT та пошук відповідного ключа
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        key_index = -1
        for i in range(len(jwks.get("keys", []))):
            if kid == jwks["keys"][i]["kid"]:
                key_index = i
                break

        if key_index == -1:
            raise HTTPException(status_code=401, detail="Public key not found. Token invalid.")

        # Отримання публічного ключа
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwks["keys"][key_index])

        # Декодування токена
        payload = jwt.decode(
            token, public_key, algorithms=["RS256"], issuer=ISSUER, options={"verify_aud": False}
        )

        # Перевірка client_id / аудиторії
        if payload.get("client_id") != CLIENT_ID and payload.get("aud") != CLIENT_ID:
            raise HTTPException(status_code=401, detail="Token issued for another application")

        # Перевірка, чи токен ще активний у Cognito
        is_alive = await auth_service.verify_token_alive(token)
        print(f"DEBUG: Token check for {payload['sub']}: {is_alive}")

        if not is_alive:
            print("DEBUG: Access DENIED")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked. Please log in again.",
            )

        return payload["sub"]

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="The token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
