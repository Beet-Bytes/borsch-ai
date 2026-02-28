import os

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from fastapi import HTTPException
from pydantic import EmailStr

load_dotenv()

# -------------------- Конфігурація Cognito --------------------
COGNITO_REGION = os.getenv("AWS_REGION")
CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")

cognito_client = boto3.client("cognito-idp", region_name=COGNITO_REGION)


# -------------------- Сервіс авторизації --------------------
class AuthService:
    def sign_up_user(self, email: EmailStr, password: str):
        try:
            response = cognito_client.sign_up(
                ClientId=CLIENT_ID,
                Username=email,
                Password=password,
                UserAttributes=[{"Name": "email", "Value": email}],
            )
            return response["UserSub"]
        except ClientError as e:
            raise HTTPException(status_code=400, detail=e.response["Error"]["Message"])

    def confirm_user(self, email: EmailStr, code: str):
        try:
            cognito_client.confirm_sign_up(
                ClientId=CLIENT_ID, Username=email, ConfirmationCode=code
            )
            return True
        except ClientError as e:
            raise HTTPException(status_code=400, detail=e.response["Error"]["Message"])

    def authenticate_user(self, email: EmailStr, password: str):
        try:
            response = cognito_client.initiate_auth(
                ClientId=CLIENT_ID,
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={"USERNAME": email, "PASSWORD": password},
            )
            return response["AuthenticationResult"]
        except ClientError:
            raise HTTPException(status_code=401, detail="Incorrect email or password")

    async def logout_user(self, access_token: str):
        try:
            cognito_client.global_sign_out(AccessToken=access_token)
            return {"status": "success", "message": "Logged out from Cognito"}
        except ClientError as e:
            return {"status": "error", "message": str(e)}

    async def verify_token_alive(self, access_token: str):
        try:
            cognito_client.get_user(AccessToken=access_token)
            return True
        except ClientError as e:
            print(f"DEBUG: Token is dead in Cognito: {e}")
            return False
