from fastapi import FastAPI
from database import setup_database
from api import users

app = FastAPI(title = "Workout Backend")

app.include_router(users.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Workout API is running!"}

if __name__ == "__main__":
    import uvicorn
    setup_database()
    uvicorn.run(app, host="0.0.0.0", port=8080)
