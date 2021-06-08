from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from ariadne import ObjectType, load_schema_from_path, make_executable_schema
from ariadne.asgi import GraphQL

from decouple import config
import requests

from .postgres.post_resolver import PostQueries, PostMutations
from .postgres.user_resolver import UserQueries, UserMutations
from .postgres.comment_resolver import CommentQueries, CommentMutations

from .auth.auth_bearer import JWTBearer
from .auth.auth_handler import signJWT

POSTGRES_URL = config("postgres_url")
POSTGRES_TOKEN = config("postgres_token")

postgres_header = {"token": POSTGRES_TOKEN}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
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

type_defs = load_schema_from_path("postgres_schema.graphql")

query = ObjectType("Query")
mutation = ObjectType("Mutation")

query.set_field("get_user", UserQueries.get_user)
query.set_field("get_users", UserQueries.get_users)
query.set_field("get_post", PostQueries.get_post)
query.set_field("get_posts_by_uid", PostQueries.get_posts_by_uid)
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