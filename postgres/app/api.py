from fastapi import FastAPI, Depends, Header, HTTPException
from decouple import config

from .postgres.posts import PostManager
from .postgres.users import UserManager
from .postgres.comments import CommentManager

ACCESS_TOKEN = config('ACCESS_TOKEN')

def verify_token(token: str = Header(...)):
    if token != ACCESS_TOKEN:
        raise HTTPException(status_code=400, detail="Invalid access token")

app = FastAPI(dependencies=[Depends(verify_token)])

@app.get('/posts/get_post', tags=['Posts'])
async def get_post(id: str):
    res = PostManager.get_post(id)
    return res

@app.get('/posts/get_posts_by_uid', tags=['Posts'])
async def get_posts_by_uid(uid: str = None):
    res = PostManager.get_posts_by_uid(uid)
    return res

@app.get('/posts/get_latest_posts', tags=['Posts'])
async def get_latest_posts():
    res = PostManager.get_latest_posts()
    return res

@app.post('/posts/create_post', tags=['Posts'])
async def create_post(title: str, user: str, content: str = None):
    res = PostManager.create_post(title, user, content)
    return res

@app.put('/posts/update_post', tags=['Posts'])
async def update_post(id: str, title: str = None, content: str = None):
    res = PostManager.update_post(id, title, content)
    return res

@app.delete('/posts/delete_post', tags=['Posts'])
async def delete_post(id: str):
    res = PostManager.delete_post(id)
    return res


@app.get('/users/get_user', tags=['Users'])
async def get_user(id: str = None, mail: str = None):
    res = UserManager.get_user(id, mail)
    return res

@app.get('/users/get_users', tags=['Users'])
async def get_users(name: str = None):
    res = UserManager.get_users(name)
    return res

@app.post('/users/create_user', tags=['Users'])
async def create_user(mail: str, name: str, password: str, profile_picture: str = None):
    res = UserManager.create_user(mail, name, password, profile_picture)
    return res

@app.put('/users/update_user', tags=['Users'])
async def update_user(id: str, mail: str = None, name: str = None, password: str = None, profile_picture: str = None):
    res = UserManager.update_user(id, mail, name, password, profile_picture)
    return res

@app.delete('/users/delete_user', tags=['Users'])
async def delete_user(id: str):
    res = UserManager.delete_user(id)
    return res


@app.get('/comments/get_comment', tags=['Comments'])
async def get_comment(id: str):
    res = CommentManager.get_comment(id)
    return res

@app.get('/comments/get_comments', tags=['Comments'])
async def get_comments(pid: str = None):
    res = CommentManager.get_comments(pid)
    return res

@app.post('/comments/create_comment', tags=['Comments'])
async def create_comment(content: str, user: str, post: str):
    res = CommentManager.create_comment(content, user, post)
    return res

@app.put('/comments/update_comment', tags=['Comments'])
async def update_comment(id: str, content: str):
    res = CommentManager.update_comment(id, content)
    return res

@app.delete('/comments/delete_comment', tags=['Comments'])
async def delete_comment(id: str):
    res = CommentManager.delete_comment(id)
    return res
