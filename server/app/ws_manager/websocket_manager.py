from fastapi import WebSocket
from typing import List, Dict

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.subscriptions: Dict[WebSocket, List[str]] = {}

    async def connect(self, websocket: WebSocket) -> None:
        try:
            await websocket.accept()
            self.active_connections.append(websocket)
            self.subscriptions[websocket] = []
        except Exception:
            raise

    async def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

        if websocket in self.subscriptions:
            del self.subscriptions[websocket]

        try:
            await websocket.close()
        except Exception as e:
            print(f"WARNING: Failed to disconnect connection: {e}")

    def subscribe(self, websocket: WebSocket, resource: str) -> None:
        if websocket not in self.active_connections:
            raise ValueError(f"Connection not active: {websocket}")

        if resource not in self.subscriptions[websocket]:
            self.subscriptions[websocket].append(resource)

    def unsubscribe(self, websocket: WebSocket, resource: str) -> None:
        if websocket not in self.active_connections:
            raise ValueError(f"Connection not active: {websocket}")

        if websocket not in self.subscriptions or resource not in self.subscriptions[websocket]:
            raise ValueError(f"Websocket is not subscribed to resource: {resource}")

        self.subscriptions[websocket].remove(resource)

    async def broadcast(self, resource: str, data:Dict, exclude_websocket: WebSocket | None = None):
        failed_connections = []
        print(f"broadcsting to {resource}, {data}")

        for ws, resources in self.subscriptions.items():
            if resource in resources and ws is not exclude_websocket:
                try:
                    await ws.send_json(data)
                except Exception:
                    failed_connections.append(ws)

        for ws in failed_connections:
            try:
                await self.disconnect(ws)
            except Exception as e:
                print(f"WARNING: Unable to close connection: {e}")
