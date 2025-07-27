from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os
from database import setup_database
from api import users, workouts
from ws_manager import websocket_manager

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

from fastapi.responses import FileResponse
@app.get("/test")
async def test_websocket():
    return FileResponse("test_websocket.html")

@app.get("/")
def root():
    return {"message": "Workout API is running!"}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    try:
        await websocket_manager.connect(ws)

        while True:
            data = await ws.receive_json()

            if data.get("type") == "subscribe":
                resource = data.get("resource")
                websocket_manager.subscribe(websocket=ws, resource=resource)

                await ws.send_json({"type": "subscribed", "resource": resource})

    except WebSocketDisconnect:
        await websocket_manager.disconnect(ws)

    except Exception as e:
        print(f"Unable to connenct websocket: {e}")
        await websocket_manager.disconnect(ws)

if __name__ == "__main__":
    import uvicorn
    setup_database()
    uvicorn.run(app, host="0.0.0.0", port=8080)
