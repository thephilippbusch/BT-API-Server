import uvicorn
from decouple import config

HOST = config("host")
PORT = config("port")
DEBUG = config("debug")

if __name__ == "__main__":
    uvicorn.run(
        "app.api:app",
        host=HOST,
        port=int(PORT),
        debug=bool(DEBUG)
    )