import psycopg2, psycopg2.extras

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="blogger",
    user="phillex")

cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

init_commands = (
    """
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            mail VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            profile_picture TEXT
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS posts (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            created TIMESTAMP NOT NULL,
            uid VARCHAR(255) NOT NULL REFERENCES
                users(id)
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS comments (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            content TEXT NOT NULL,
            created TIMESTAMP NOT NULL,
            pid VARCHAR(255) NOT NULL REFERENCES
                posts(id),
            uid VARCHAR(255) NOT NULL REFERENCES
                users(id)
        )
    """
)

for command in init_commands:
    cur.execute(command)

conn.commit()

class PostgreSQL:
    def connection():
        return conn

    def cursor():
        return cur