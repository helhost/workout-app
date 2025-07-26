from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import setup_database
from api import users, workouts

app = FastAPI(title = "Workout Backend")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api")
app.include_router(workouts.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Workout API is running!"}

if __name__ == "__main__":
    import uvicorn
    setup_database()
    uvicorn.run(app, host="0.0.0.0", port=8080)
