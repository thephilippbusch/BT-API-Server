import uuid
from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017/")

db_list = mongo_client.list_database_names()

blogger_chat_db = mongo_client["blogger-chat"]

class ForumHandler:
  def create_forum(name: str, user_id: str, description: str = None):
    try:
      forums_collection = blogger_chat_db["forums"]

      payload = {
        "_id": str(uuid.uuid4()),
        "name": name,
        "description": description,
        "user_id": user_id,
      }
      
      res = forums_collection.insert_one(payload)
      forum_id = res.inserted_id

      message_collection = blogger_chat_db["messages"]

      init_message = {
        "_id": str(uuid.uuid4()),
        "message": f"Welcome to the {name} forum. Have fun!",
        "name": "Blogger Chatbot",
        "forum_id": forum_id
      }
      message_collection.insert_one(init_message)
      return forum_id
    except Exception as e:
      print(str(e))
      return False

  def get_forums(name: str = None):
    try:
      forums_collection = blogger_chat_db["forums"]
      query = {}
      data = []

      if name is not None:
        query = {"name": name}
      res = forums_collection.find(query)

      for forum in res:
        data.append(forum)
      return data
    except Exception as e:
      print(str(e))
      return False

  def delete_forum(forum_id: str):
    try:
      forums_collection = blogger_chat_db["forums"]
      remove_query = { "_id": forum_id }

      forums_collection.delete_one(remove_query)

      message_collection = blogger_chat_db["messages"]
      remove_messages = { "forum_id": forum_id }

      message_collection.delete_many(remove_messages)
      return True
    except Exception as e:
      print(str(e))
      return False


class MessageHandler:
  def create_message(message: str, user_id: str, name: str, forum_id: str):
    try:
      message_collection = blogger_chat_db["messages"]
      payload = {
        "_id": str(uuid.uuid4()),
        "message": message,
        "name": name,
        "user_id": user_id,
        "forum_id": forum_id
      }
      res = message_collection.insert_one(payload)

      return res.inserted_id
    except Exception as e:
      print(str(e))
      return False

  def get_messages_by_forum(forum_id: str):
    try:
      message_collection = blogger_chat_db["messages"]
      data = []

      res = message_collection.find({ "forum_id": forum_id })

      for message in res:
        data.append(message)

      return data
    except Exception as e:
      print(str(e))
      return False
