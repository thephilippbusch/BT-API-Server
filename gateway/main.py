import uvicorn

config = {"dev": {"host": "0.0.0.0", "port": 8000, "debug": True}}

if __name__ == "__main__":
    uvicorn.run(
        "app.api:app",
        host=config["dev"]["host"],
        port=config["dev"]["port"],
        debug=config["dev"]["debug"],
    )