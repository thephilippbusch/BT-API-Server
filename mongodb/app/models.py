from typing import Optional
from pydantic import BaseModel

class MessageModel(BaseModel):
  name: str
  message: str
  forum_id: str
  user_id: str

class ForumModel(BaseModel):
  name: str
  user_id: str
  description: Optional[str] = None
