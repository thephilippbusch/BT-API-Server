from fastapi import FastAPI, WebSocket
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ariadne import ObjectType, load_schema_from_path, make_executable_schema
from ariadne.asgi import GraphQL
from fastapi.params import Depends
from starlette.responses import JSONResponse
from starlette.status import HTTP_401_UNAUTHORIZED

from decouple import config
import requests, json

from .postgres.post_resolver import PostQueries, PostMutations
from .postgres.user_resolver import UserQueries, UserMutations
from .postgres.comment_resolver import CommentQueries, CommentMutations

from .auth.auth_handler import signJWT
from .auth.auth_bearer import JWTBearer

from .mongo.connection_handler import ConnectionHandler

from elasticapm.contrib.starlette import make_apm_client, ElasticAPM

POSTGRES_URL = config("postgres_url")
POSTGRES_TOKEN = config("postgres_token")
MONGO_URL = config("mongo_url")
MONGO_TOKEN = config("mongo_token")

postgres_header = {"token": POSTGRES_TOKEN}
mongo_header = {"token": MONGO_TOKEN}

app = FastAPI()

handler = ConnectionHandler()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

apm_config = {
 'SERVICE_NAME': 'BloggerGateway',
 'SERVER_URL': 'http://localhost:8200',
 'ENVIRONMENT': 'dev',
 'GLOBAL_LABELS': 'platform=BloggerGatewayPlatform, application=BloggerGatewayApplication'
}
apm_client = make_apm_client(apm_config)

app.add_middleware(
  ElasticAPM,
  client=apm_client
)

@app.get("/auth/signup", tags=['Authentication'])
async def sign_up(email: str, name: str, password: str):
    try:
        req_url = f"{POSTGRES_URL}users/create_user"
        payload = {
            "mail": email,
            "name": name,
            "password": password,
        }

        res = requests.post(req_url, params = payload, headers = postgres_header)
        data = res.json()

        if data["success"]:
            payload = data
            payload["token"] = signJWT(email)
            return payload
        return {
            "succesful": False,
            "error": "User could not be created"
        }
    except Exception as e:
        print(e)
        return {
            "succesful": False,
            "error": str(e)
        }

@app.get("/auth/signin", tags=['Authentication'])
async def sign_in(email: str, password: str):
    try:
        req_url = f"{POSTGRES_URL}users/get_user?mail={email}"
        res = requests.get(req_url, headers = postgres_header)
        data = res.json()

        if not data["success"]:
            return data
        
        if data["data"]["mail"] == email and data["data"]["password"] == password:
            token = signJWT(email)
            return {
                "success": True,
                "id": data["data"]["id"],
                "token": token
            }
        return {
            "success": False,
            "error": "Wrong email and/or password"
        }

    except Exception as e:
        print(e)
        return {
            "success": False,
            "error": str(e)
        }

@app.websocket("/blogger_chat/{channel}")
async def blogger_chat(ws: WebSocket, channel: str):
    try:
        token = ws.headers["Authentication"][7:]
        is_valid = JWTBearer.verify_jwt(JWTBearer, token)
        if not is_valid:
            return JSONResponse(status_code=401)

        await handler.connect(ws, channel)

        while True:
            data = await ws.receive_json()
            print(data)

            req_url = f"{MONGO_URL}add_message_to_forum"

            res = requests.post(req_url, params=data, headers = mongo_header)
            result = res.json()

            if not result["success"]:
                e = result["error"]
                print(f"Error: {e}")

            if data and result["success"]:
                data["_id"] = result["id"]
                await handler.send_to_room(data, channel)
        
    except Exception as e:
        print(f"Exception: {str(e)}")

@app.get("/forums/get_forums", tags=["Messaging Service"], dependencies=[Depends(JWTBearer())])
async def get_forums(name: str = None):
    try:
        url_path = f"{MONGO_URL}get_forums"
        payload = {}
        if name:
            payload = {"name": name}
        
        res = requests.get(url_path, params=payload, headers=mongo_header)
        result = res.json()

        return result
    except Exception as e:
        print(str(e))
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/forums/create_forum", tags=["Messaging Service"], dependencies=[Depends(JWTBearer())])
async def create_forum(name: str, user_id: str, description: str = None):
    try:
        url_path = f"{MONGO_URL}create_forum"
        payload = {
            "name": name,
            "user_id": user_id,
            "description": description
        }
        
        res = requests.post(url_path, params=payload, headers=mongo_header)
        result = res.json()

        return result
    except Exception as e:
        print(str(e))
        return {
            "success": False,
            "error": str(e)
        }

@app.delete("/forums/delete_forum", tags=["Messaging Service"], dependencies=[Depends(JWTBearer())])
async def delete_forum(forum_id: str):
    try:
        url_path = f"{MONGO_URL}delete_forum"
        payload = {
            "forum_id": forum_id
        }
        
        res = requests.delete(url_path, params=payload, headers=mongo_header)
        result = res.json()

        return result
    except Exception as e:
        print(str(e))
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/messages/get_messages_by_forum", tags=["Messaging Service"], dependencies=[Depends(JWTBearer())])
async def get_messages_by_forum(forum_id: str):
    try:
        url_path = f"{MONGO_URL}get_messages_by_forum"
        payload = {"forum_id": forum_id}
        
        res = requests.get(url_path, params=payload, headers=mongo_header)
        result = res.json()

        return result
    except Exception as e:
        print(str(e))
        return {
            "success": False,
            "error": str(e)
        }

type_defs = load_schema_from_path("postgres_schema.graphql")

query = ObjectType("Query")
mutation = ObjectType("Mutation")

query.set_field("get_user", UserQueries.get_user)
query.set_field("get_users", UserQueries.get_users)
query.set_field("get_post", PostQueries.get_post)
query.set_field("get_posts_by_uid", PostQueries.get_posts_by_uid)
query.set_field("get_posts_by_query", PostQueries.get_posts_by_query)
query.set_field("get_latest_posts", PostQueries.get_latest_posts)
query.set_field("get_comments", CommentQueries.get_comments)
query.set_field("get_comment", CommentQueries.get_comment)

mutation.set_field("create_post", PostMutations.create_post)
mutation.set_field("update_post", PostMutations.update_post)
mutation.set_field("delete_post", PostMutations.delete_post)

mutation.set_field("update_user", UserMutations.update_user)
mutation.set_field("delete_user", UserMutations.delete_user)

mutation.set_field("create_comment", CommentMutations.create_comment)
mutation.set_field("update_comment", CommentMutations.update_comment)
mutation.set_field("delete_comment", CommentMutations.delete_comment)


schema = make_executable_schema(type_defs, query, mutation)

app.add_route("/postgres", GraphQL(schema, debug=True))
