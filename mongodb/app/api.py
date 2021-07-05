from fastapi import FastAPI, WebSocket, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from decouple import config

from .connection_handler import ConnectionHandler
from .models import MessageModel, ForumModel

from .mongo import ForumHandler, MessageHandler

ACCESS_TOKEN = config('access_token')

def verify_token(token: str = Header(...)):
    if token != ACCESS_TOKEN:
        raise HTTPException(status_code=400, detail="Invalid access token")

app = FastAPI(dependencies=[Depends(verify_token)])

handler = ConnectionHandler()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.get("/get_forums", tags=["Forum"])
async def get_forums(name: str = None):
  try:
    res = ForumHandler.get_forums(name)

    if res is None:
      return {
        "success": False,
        "error": "Error while fetching forums from database"
      }

    return {
      "success": True,
      "data": res
    }
  except Exception as e:
    print(str(e))
    return {
      "success": False,
      "error": str(e)
    }

@app.post("/create_forum", tags=["Forum"])
async def create_forum(name: str, user_id: str, description: str = None):
  try:
    res = ForumHandler.create_forum(name, user_id, description)

    forum_id = res
    if not res:
      return {
        "success": False,
        "error": "Error while writing to database"
      }

    return {
      "success": True,
      "id": forum_id
    }
  except Exception as e:
    print(str(e))
    return {
      "success": False,
      "error": str(e)
    }

@app.delete("/delete_forum", tags=["Forum"])
async def delete_forum(forum_id: str):
  try:
    res = ForumHandler.delete_forum(forum_id)    

    if not res:
      return {
        "success": False,
        "error": "Error while deleting from database"
      }

    return {
      "success": True,
    }
  except Exception as e:
    print(str(e))
    return {
      "success": False,
      "error": str(e)
    }

@app.get("/get_messages_by_forum", tags=["Messages"])
async def get_messages_by_forum(forum_id: str):
  try:
    res = MessageHandler.get_messages_by_forum(forum_id)

    if res is None or res is False:
      return {
        "success": False,
        "error": "Error while fetching messages from database"
      }

    return {
      "success": True,
      "data": res
    }
  except Exception as e:
    print(str(e))
    return {
      "success": False,
      "error": str(e)
    }

@app.post("/add_message_to_forum", tags=["Messages"])
async def add_message_to_forum(message: str, user_id: str, name: str, forum_id: str):
  try:
    print(message)
    res = MessageHandler.create_message(
      message, 
      user_id, 
      name, 
      forum_id
    )

    message_id = res

    if not res:
      return {
        "success": False,
        "error": "Error while writing to database"
      }

    return {
      "success": True,
      "id": message_id
    }
  except Exception as e:
    print(str(e))
    return {
      "success": False,
      "error": str(e)
    }
