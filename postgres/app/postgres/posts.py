from app.postgres.postgres import PostgreSQL
import uuid
import datetime

conn = PostgreSQL.connection()
cur = PostgreSQL.cursor()

class PostManager:
    def get_post(id: str):
        try:
            query = (f"""
                SELECT * FROM posts 
                WHERE id = '{id}';
            """)
            cur.execute(query)
            data = cur.fetchone()
            if data is not None:
                post = dict(data)
                user_query = (f"""
                    SELECT * FROM users WHERE id = '{post["uid"]}';
                """)
                cur.execute(user_query)
                user_res = cur.fetchone()
                post["user"] = dict(user_res)
                return {
                    'success': True,
                    'data': post
                }
            return {
                'success': False,
                'error': f'The Post with the id "{id}" does not exist'
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }

    def get_posts_by_uid(uid: str):
        try:
            data = []
            query = (f"""
                SELECT * FROM posts WHERE uid = '{uid}' ORDER BY created DESC;
            """)
            cur.execute(query)
            res = cur.fetchall()
            for row in res:
                post = dict(row)
                user_query = (f"""
                    SELECT * FROM users WHERE id = '{post["uid"]}';
                """)
                cur.execute(user_query)
                user_res = cur.fetchone()
                print(user_res)
                post["user"] = dict(user_res)
                data.append(post)
            return {
                'success': True,
                'total': len(data),
                'data': data
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }

    def get_latest_posts():
        try:
            data = []
            query = (f"""
                SELECT * FROM posts ORDER BY created desc LIMIT 100;
            """)
            cur.execute(query)
            res = cur.fetchall()
            for row in res:
                post = dict(row)
                user_query = (f"""
                    SELECT * FROM users WHERE id = '{post["uid"]}';
                """)
                cur.execute(user_query)
                user_res = cur.fetchone()
                post["user"] = dict(user_res)
                data.append(post)
            return {
                'success': True,
                'total': len(data),
                'data': data
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }

    def create_post(title: str, user: str, content: str = None):
        try:
            id = uuid.uuid4()
            created = datetime.datetime.now().isoformat()

            req = (f"""
                INSERT INTO posts (id, title, created, uid, content)
                VALUES ('{id}', '{title}', '{created}', '{user}', '{content}');
            """)

            cur.execute(req)
            conn.commit()

            user_req = (f"""
                SELECT * FROM users WHERE id = '{user}';
            """)
            cur.execute(user_req)
            user_object = cur.fetchone()
            return {
                'success': True,
                'data': {
                    "id": id,
                    "title": title,
                    "content": content,
                    "created": created,
                    "user": dict(user_object),
                }
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }

    def update_post(id: str, title: str = None, content: str = None):
        try:
            print(id)
            check_id = (f"""
                SELECT * FROM posts WHERE id = '{id}';
            """)
            cur.execute(check_id)
            id_exists = cur.fetchall()
            print(id_exists)
            if len(id_exists) == 0:
                return {
                    'success': False,
                    'error': 'The Post to be updated does not exist'
                }

            if title is None and content is None:
                return {
                    'success': False,
                    'error': 'Please provide something to update'
                }
            args_arr = []
            if title is not None:
                args_arr.append(f"title = '{title}'")
            if content is not None:
                args_arr.append(f"content = '{content}'")

            req = (f"""
                Update posts
                SET {', '.join(args_arr)}
                WHERE id = '{id}';
            """)

            cur.execute(req)
            conn.commit()
            return {
                'success': True
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }

    def delete_post(id: str):
        try:
            check_id = (f"""
                SELECT * FROM posts WHERE id = '{id}';
            """)
            cur.execute(check_id)
            id_exists = cur.fetchone()
            if id_exists is None:
                return {
                    'success': False,
                    'error': 'The Post to be deleted does not exist'
                }
            
            delete_post = (f"""
                DELETE FROM posts WHERE id = '{id}' RETURNING title;
            """)
            cur.execute(delete_post)
            deleted = cur.rowcount

            if deleted > 0:
                return {
                    'success': True
                }
            return {
                'success': False,
                'error': 'Post could not be deleted'
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }