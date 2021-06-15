from fastapi import FastAPI
from pydantic import BaseModel
from elasticsearch import Elasticsearch

app = FastAPI()

es = Elasticsearch()

class User(BaseModel):
    id: str
    mail: str
    name: str
    password: str
    profile_picture: str

class Post(BaseModel):
    id: str
    title: str
    content: str
    created: str
    user: User

@app.post("/insert_post", tags=["Elasticsearch"])
async def insert_post(post: Post):
    try:
        payload = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "created": post.created,
            "user": {
                "id": post.user.id,
                "mail": post.user.mail,
                "name": post.user.name,
                "password": post.user.password,
                "profile_picture": post.user.profile_picture
            }
        }

        res = es.index(
            index="blogger-search",
            body=payload
        )

        return {
            "success": True,
            "id": post.id
        }
    except Exception as e:
        print(e)
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/get_posts_by_query", tags=["Elasticsearch"])
async def get_posts_by_query(query: str):
    try:
        post_list = []

        res = es.search(
            index="blogger-search",
            body={
                "query": {
                    "query_string": {
                        "query": query
                    }
                }
            }
        )
        print(res)

        if not res:
            return {
                "success": False,
                "error": "Something went wrong with elasticsearch"
            }

        for hit in res['hits']['hits']:
            post_list.append(hit['_source'])
        return {
            "success": True,
            "data": post_list
        }
    except Exception as e:
        print(e)
        return {
            "success": False,
            "error": str(e)
        }