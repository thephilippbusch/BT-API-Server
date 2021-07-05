from ..auth.auth_bearer import JWTBearer

from decouple import config
import requests

POSTGRES_URL = config("postgres_url")
POSTGRES_TOKEN = config("postgres_token")
PUBLIC_KEY = config("public_key")

postgres_header = {"token": POSTGRES_TOKEN}

class UserQueries:
    def get_user(obj, info, id: str = None, mail: str = None):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            if token == PUBLIC_KEY:
                if id is not None:
                    req_url = f"{POSTGRES_URL}users/get_user?id={id}"
                else:
                    req_url = f"{POSTGRES_URL}users/get_user?mail={mail}"
                res = requests.get(req_url, headers=postgres_header)
                data = res.json()
                
                return data
            return {
                "success": False,
                "error": "Invalid api key"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_users(obj, info, name: str = None):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            if token == PUBLIC_KEY:
                req_url = f"{POSTGRES_URL}users/get_users"
                if name is not None:
                    req_url = f"{POSTGRES_URL}users/get_users?name={name}"

                res = requests.get(req_url, headers=postgres_header)
                data = res.json()
                    
                return data
            return {
                "success": False,
                "error": "Invalid api key"
            }
        except Exception as e:
            print(e)
            return {
                "success": False,
                "error": str(e)
            }

class UserMutations:
    def update_user(obj, info, id: str, name: str = None, mail: str = None, password: str = None, profile_picture: str = None):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}users/update_user"
                payload = {
                    "id": id,
                    "name": name,
                    "mail": mail,
                    "password": password,
                    "profile_picture": profile_picture,
                }

                res = requests.put(req_url, params=payload, headers=postgres_header)
                data = res.json()

                return data
            return {
                "success": False,
                "error": "Invalid authentication"
            }
        except Exception as e:
            print(e)
            return {
                "success": False,
                "error": str(e)
            }
    
    def delete_user(obj, info, id: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}users/delete_user"
                payload = {
                    "id": id
                }

                res = requests.delete(req_url, params=payload, headers=postgres_header)
                data = res.json()

                return data
            return {
                "success": False,
                "error": "Invalid authentication"
            }
        except Exception as e:
            print(e)
            return {
                "success": False,
                "error": str(e)
            }
