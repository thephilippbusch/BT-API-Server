from decouple import config
import uvicorn

PORT = config("port")
HOST = config("host")
DEBUG = config("debug")

if __name__ == "__main__":
    uvicorn.run(
        "app.api:app",
        host=HOST,
        port=int(PORT),
        debug=bool(DEBUG)
    )