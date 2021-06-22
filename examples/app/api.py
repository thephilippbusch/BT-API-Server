from fastapi import FastAPI, Depends, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid, xmljson

import aioredis
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

from elasticapm.contrib.starlette import make_apm_client, ElasticAPM

import xml.etree.ElementTree as ET

app = FastAPI()

users = [{
  "id": "2479898b-2c27-4b79-9f59-8f61c2d2ce14",
  "title": "Mr",
  "given_name": "Philipp",
  "family_name": "Busch",
  "mail": "philipp.busch@bayer.com",
  "age": 20,
  "bio": "My name is Philipp and I like coding!"
}]

origins = [
  "localhost:3000",
  "http://localhost:3000",
  "www.example.com",
  "https://www.example.com"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["GET", "POST"],
  allow_headers=["Authorization"],
)

apm_config = {
 'SERVICE_NAME': 'ExampleGateway',
 'SERVER_URL': 'http://localhost:8200',
 'ENVIRONMENT': 'dev',
 'GLOBAL_LABELS': 'platform=ExampleGatewayPlatform, application=ExampleGatewayApplication'
}
apm_client = make_apm_client(apm_config)

app.add_middleware(
  ElasticAPM,
  client=apm_client
)

class User(BaseModel):
  title: str
  given_name: str
  family_name: str
  mail: str
  age: Optional[int] = None
  bio: Optional[str] = None


@app.on_event("startup")
async def startup():
    redis = await aioredis.create_redis_pool("redis://localhost")
    await FastAPILimiter.init(redis)

@app.get("/get_users", tags=["Example"], dependencies=[Depends(RateLimiter(times=2, seconds=20))])
async def get_users():
  try:
    return {
      "status": "Successful",
      "status_code": 200,
      "data": users
    }
  except Exception as e:
    print(e)

@app.post("/create_user", tags=["Example"])
async def create_user(user: User):
  try:
    user_dict = dict(user)
    user_dict["id"] = uuid.uuid4()
    users.append(user_dict)
    return {
      "status": "Successful",
      "status_code": 200,
      "message": "User successfully created!"
    }
  except Exception as e:
    print(e)

@app.delete("/delete_user", tags=["Example"])
async def delete_user(name: str):
  return {"message": f"Successfully deleted: {name}"}

@app.post("/xml", tags=["Compatibility"])
async def parse_xml(request: Request, accept: Optional[str] = Header(default='application/xml')):
  xml = await request.body()
  root = ET.fromstring(xml)
  response = xmljson.badgerfish.data(root)
  return {
    "status_code": 200,
    "status": "Successful",
    "data": response
  }

