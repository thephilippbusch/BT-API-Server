from typing import ClassVar
from ..auth.auth_bearer import JWTBearer

from decouple import config
import requests

POSTGRES_URL = config("postgres_url")
ELASTIC_URL = config("elastic_url")
POSTGRES_TOKEN = config("postgres_token")
PUBLIC_KEY = config("public_key")

postgres_header = {"token": POSTGRES_TOKEN}

class PostQueries:
    def get_post(obj, info, id: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            if token == PUBLIC_KEY:
                req_url = f"{POSTGRES_URL}posts/get_post?id={id}"
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

    def get_posts_by_uid(obj, info, uid: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            if token == PUBLIC_KEY:
                req_url = f"{POSTGRES_URL}posts/get_posts_by_uid?uid={uid}"
                res = requests.get(req_url, headers=postgres_header)
                data = res.json()

                print(data)

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

    def get_posts_by_query(obj, info, query: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            if token == PUBLIC_KEY:
                req_url = f"{ELASTIC_URL}get_posts_by_query?query={query}"
                res = requests.get(req_url)
                data = res.json()

                print(data)

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

    def get_latest_posts(obj, info):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            if token == PUBLIC_KEY:
                req_url = f"{POSTGRES_URL}posts/get_latest_posts"
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


class PostMutations:
    def create_post(obj, info, title: str, uid: str, content: str = None):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}posts/create_post"
                payload = {
                    "title": title,
                    "user": uid,
                    "content": content
                }

                res = requests.post(req_url, params=payload, headers=postgres_header)
                data = res.json()

                elasticsearch_url = f"{ELASTIC_URL}insert_post"
                if data["success"]:
                    post = data["data"]
                    user = post["user"]
                    payload = {
                        "id": post["id"],
                        "title": post["title"],
                        "content": post["content"],
                        "created": post["created"],
                        "user": user
                    }
                    print(payload)
                    elastic_res = requests.post(elasticsearch_url, json=payload)
                    print(elastic_res)

                return {
                    "success": True,
                    "id": data["data"]["id"]
                }
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

    def update_post(obj, info, id: str, title: str = None, content: str = None):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}posts/update_post"
                payload = {
                    "id": id,
                    "title": title,
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
    
    def delete_post(obj, info, id: str):
        try:
            token = info.context["request"].headers["Authentication"][7:]
            is_valid = JWTBearer.verify_jwt(JWTBearer, token)
            if is_valid:
                req_url = f"{POSTGRES_URL}posts/delete_post"
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
