from ..auth.auth_bearer import JWTBearer

from decouple import config
import requests

POSTGRES_URL = config("postgres_url")
POSTGRES_TOKEN = config("postgres_token")

postgres_header = {"token": POSTGRES_TOKEN}

class CommentQueries:
    def get_comment(obj, info, id: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}comments/get_comment?id={id}"
                res = requests.get(req_url, headers=postgres_header)
                data = res.json()

                return data
            return {
                "success": False,
                "error": "Invalid authentication token"
            }
        except Exception as e:
            print(e)
            return {
                "success": False,
                "error": str(e)
            }

    def get_comments(obj, info, pid: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}comments/get_comments?pid={pid}"
                res = requests.get(req_url, headers=postgres_header)
                data = res.json()

                return data
            return {
                "success": False,
                "error": "Invalid authentication token"
            }
        except Exception as e:
            print(e)
            return {
                "success": False,
                "error": str(e)
            }

class CommentMutations:
    def create_comment(obj, info, content: str, uid: str, pid: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}comments/create_comment"
                payload = {
                    "content": content,
                    "user": uid,
                    "post": pid
                }

                res = requests.post(req_url, params=payload, headers=postgres_header)
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

    def update_comment(obj, info, id: str, content: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}comments/update_comment"
                payload = {
                    "id": id,
                    "content": content
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
    
    def delete_comment(obj, info, id: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}comments/delete_comment"
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
