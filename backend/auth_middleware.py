import os

import jwt
import requests
from dotenv import load_dotenv
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

COGNITO_REGION = os.getenv("AWS_REGION")
USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")

JWKS_URL = (
    f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"
)
ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"

try:
    jwks = requests.get(JWKS_URL).json()
except Exception as e:
    print(f"JWKS loading error: {e}")
    jwks = {"keys": []}

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Checks the JWT token and returns the user_id (sub).
    """
    token = credentials.credentials

    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        key_index = -1
        for i in range(len(jwks.get("keys", []))):
            if kid == jwks["keys"][i]["kid"]:
                key_index = i
                break

        if key_index == -1:
            raise HTTPException(status_code=401, detail="Public key not found. Token invalid.")

        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwks["keys"][key_index])

        payload = jwt.decode(
            token, public_key, algorithms=["RS256"], issuer=ISSUER, options={"verify_aud": False}
        )

        if payload.get("client_id") != CLIENT_ID and payload.get("aud") != CLIENT_ID:
            raise HTTPException(status_code=401, detail="Token issued for another application")

        return payload["sub"]

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="The token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
