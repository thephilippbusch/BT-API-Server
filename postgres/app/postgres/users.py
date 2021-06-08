from app.postgres.postgres import PostgreSQL
import uuid

conn = PostgreSQL.connection()
cur = PostgreSQL.cursor()

class UserManager:
    def get_user(id: str, mail: str):
        try:
            if id is None and mail is None:
                return {
                    'success': False,
                    'error': 'Please provide a query parameter'
                }
            if id is not None and mail is not None:
                return {
                    'success': False,
                    'error': 'Please only provide one query parameter'
                }
            args = ''
            if id is not None:
                args = f"id = '{id}'"
            if mail is not None:
                args = f"mail = '{mail}'"

            query = (f"""
                SELECT * FROM users 
                WHERE {args};
            """)
            cur.execute(query)
            res = cur.fetchone()
            if res:
                data = dict(res)
                return {
                    'success': True,
                    'data': data
                }
            return {
                'success': False,
                'error': f'No user could be found'
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }

    def get_users(name: str = None):
        try:
            data = []
            query_string = ""
            if name is not None:
                query_string = f"WHERE name = '{name}'"
            query = (f"""
                SELECT * FROM users {query_string};
            """)
            cur.execute(query)
            res = cur.fetchall()
            data = []
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

    def create_user(mail: str, name: str, password: str, profile_picture: str = None):
        try:
            id = uuid.uuid4()

            req = (f"""
                INSERT INTO users (id, mail, name, password, profile_picture)
                VALUES ('{id}', '{mail}', '{name}', '{password}', '{profile_picture}');
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

    def update_user(id: str, mail: str = None, name: str = None, password: str = None, profile_picture: str = None):
        try:
            check_id = (f"""
                SELECT * FROM users WHERE id = '{id}';
            """)
            cur.execute(check_id)
            id_exists = cur.fetchall()
            if len(id_exists) == 0:
                return {
                    'success': False,
                    'error': 'The User to be updated does not exist'
                }

            if mail is None and name is None and password is None and profile_picture is None:
                return {
                    'success': False,
                    'error': 'Please provide something to update'
                }
            args_arr = []
            if mail is not None:
                args_arr.append(f"mail = '{mail}'")
            if name is not None:
                args_arr.append(f"name = '{name}'")
            if password is not None:
                args_arr.append(f"password = '{password}'")
            if profile_picture is not None:
                args_arr.append(f"profile_picture = '{profile_picture}'")

            req = (f"""
                Update users
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

    def delete_user(id: str):
        try:
            check_id = (f"""
                SELECT * FROM users WHERE id = '{id}';
            """)
            cur.execute(check_id)
            id_exists = cur.fetchone()
            if id_exists is None:
                return {
                    'success': False,
                    'error': 'The User to be deleted does not exist'
                }
            
            delete_user = (f"""
                DELETE FROM users WHERE id = '{id}' RETURNING mail
            """)
            cur.execute(delete_user)
            deleted = cur.rowcount

            if deleted > 0:
                return {
                    'success': True
                }
            return {
                'success': False,
                'error': 'User could not be deleted'
            }
        except Exception as e:
            print(e)
            return {
                'success': False,
                'error': str(e)
            }