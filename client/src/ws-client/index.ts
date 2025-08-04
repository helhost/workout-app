import type { callback } from "@/types";

export class WebSocketClient {
  private baseURL: string;
  private socket: WebSocket | null = null;
  private subscriptions: Map<string, (data: any) => void> = new Map()

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  public connect(): void {
    this.socket = new WebSocket(this.baseURL.replace('http', 'ws') + '/ws');

    this.socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        const resource = message.resource;
        const callback = this.subscriptions.get(resource);

        if (callback) {
          callback({
            type: message.type,
            data: message.data
          });
        } else {
          console.warn(`No resource found for resource: ${resource}`);
        };
      } catch (e) {
        console.error("Failed to handle websocket message:", e);
      };
    });
  };

  public close(): void {
    this.socket?.close();
  };

  public subscribe(resource: string, callback: callback): void {
    this.subscriptions.set(resource, callback);

    const sendSubscribe = () => {
      this.socket?.send(JSON.stringify({ action: "subscribe", resource: resource }));
    };

    if (!this.socket || this.socket.readyState != WebSocket.OPEN) {
      this.socket?.addEventListener("open", sendSubscribe, { once: true });
    } else {
      sendSubscribe();
    };
  };

  public unsubscribe(resource: string): void {
    this.subscriptions.delete(resource);

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action: "unsubscribe", resource: resource }));
    }
  };

}
