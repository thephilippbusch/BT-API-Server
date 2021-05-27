from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/test", tags=['Test'])
async def get_test(q: str = None):
    try:
        if q == 'ping':
            return {
                "status_code": 200,
                "status": "Successful",
                "data": "pong"
            }
        return {
            "status_code": 200,
                "status": "Successful",
                "data": "message"
        }
    except Exception as e:
        print(e)
        return {
            "status_code": 400,
            "status": "Error",
            "message": "Something went wrong!"
        }