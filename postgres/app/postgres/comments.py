from app.postgres.postgres import PostgreSQL
import uuid
import datetime

conn = PostgreSQL.connection()
cur = PostgreSQL.cursor()

class CommentManager:
    def get_comment(id: str):
        try:
            query = (f"""
                SELECT * FROM comments 
                WHERE id = '{id}';
            """)
            cur.execute(query)
            data = cur.fetchone()
            if data is not None:
                return {
                    'success': True,
                    'data': dict(data)
                }
            return {
                'success': False,
                'error': f'The Comment with the id "{id}" does not exist'
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }

    def get_comments(post: str):
        try:
            data = []
            query = (f"""
                SELECT * FROM comments
                WHERE pid = '{post}';
            """)
            cur.execute(query)
            res = cur.fetchall()
            for row in res:
                data.append(dict(row))
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

    def create_comment(content: str, user: str, post: str):
        try:
            id = uuid.uuid4()
            created = datetime.datetime.now().isoformat()

            req = (f"""
                INSERT INTO comments (id, content, pid, uid, created)
                VALUES ('{id}', '{content}', '{post}', '{user}', '{created}');
            """)

            cur.execute(req)
            conn.commit()
            return {
                'success': True,
                'id': id
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }

    def update_comment(id: str, content: str):
        try:
            check_id = (f"""
                SELECT * FROM comments WHERE id = {id}
            """)
            cur.execute(check_id)
            id_exists = cur.fetchall()
            if len(id_exists) == 0:
                return {
                    'success': False,
                    'error': 'The Post to be updated does not exist'
                }

            req = (f"""
                Update comments
                SET content = '{content}'
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

    def delete_comment(id: str):
        try:
            check_id = (f"""
                SELECT * FROM comments WHERE id = '{id}';
            """)
            cur.execute(check_id)
            id_exists = cur.fetchone()
            if id_exists is None:
                return {
                    'success': False,
                    'error': 'The Comment to be deleted does not exist'
                }
            
            delete_post = (f"""
                DELETE FROM comments WHERE id = '{id}';
            """)
            cur.execute(delete_post)
            deleted = cur.rowcount

            if deleted > 0:
                return {
                    'success': True
                }
            return {
                'success': False,
                'error': 'Comment could not be deleted'
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }