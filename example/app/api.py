from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

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

class User(BaseModel):
  title: str
  given_name: str
  family_name: str
  mail: str
  age: Optional[int] = None
  bio: Optional[str] = None


@app.get("/ping", tags=["Ping Pong", "Example"])
async def ping_pong():
  return "pong"

@app.delete("/delete_something", tags=["Example"])
async def delete_something(name: str):
  return {"message": f"Successfully deleted: {name}"}

@app.post("/create_user", tags=["Example"])
async def create_user(user: User):
  result_string = f"""
    Hello {user.title} {user.given_name} {user.family_name},
    We are pleased to see, that you decided to go with our App!
    You are {user.age} Years old and your Bio says:
    {user.bio}

    Please confirm your registration with the email we send to {user.mail}
  """
  return result_string