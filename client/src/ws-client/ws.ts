import type { SubscriptionCallback, Resource, WebSocketLike } from "@/types";

const READY = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

export class WebSocketClient {
  private url: string;
  private socket: WebSocketLike | null = null;
  private subs = new Map<Resource, SubscriptionCallback>();

  constructor(baseURL: string, path: string = '/ws') {

    if (/^http(s)?:\/\//.test(baseURL)) {
      this.url = baseURL.replace(/\/$/, "").replace(/^http/, "ws") + path;

    } else {
      this.url = baseURL;
    };
  };

  private isOpen(): boolean {
    return this.socket?.readyState === READY.OPEN;
  }

  public async connect(): Promise<void> {
    const wsImpl: any = (globalThis as any).WebSocket;
    if (!wsImpl) throw new Error("WebSocketClient: globalThis.WebSocket is not available");

    if (this.isOpen()) return;

    this.socket = new wsImpl(this.url) as WebSocketLike;

    const onMessage = (ev: any) => {
      // browser: ev.data; node 'ws': data is passed directly (string/Buffer)
      const raw = typeof ev === "string" ? ev : ev?.data ?? ev;
      const text = typeof raw === "string" ? raw : raw?.toString?.();
      if (!text) return;

      let msg: any;
      try {
        msg = JSON.parse(text);
      } catch {
        return;
      };

      if (typeof msg?.resource !== "string") {
        return;
      }

      const cb = this.subs.get(msg.resource as Resource);
      if (cb) cb(msg);

    };

    if (typeof (this.socket as any).addEventListener === "function") {
      (this.socket as any).addEventListener("message", onMessage);
    } else if (typeof (this.socket as any).on === "function") {
      (this.socket as any).on("message", onMessage);
    };

    await new Promise<void>((resolve, reject) => {
      const onOpen = () => resolve();
      const onError = (err: any) => reject(err);

      if (typeof (this.socket as any).addEventListener === "function") {
        (this.socket as any).addEventListener("open", onOpen, { once: true });
        (this.socket as any).addEventListener("error", onError, { once: true });

      } else if (typeof (this.socket as any).once === "function") {
        (this.socket as any).once("open", onOpen);
        (this.socket as any).once("error", onError);

      } else {
        reject(new Error("Unknown WebSocket Implementation"));
      };
    });

  };


  public disconnect(): void {
    if (!this.socket) return;
    try {
      this.socket.close();
    } finally {
      this.socket = null;
    };
  };

  public subscribe(resource: Resource, cb: SubscriptionCallback): void {
    this.subs.set(resource, cb);

    const sendSubscribe = () => {
      this.socket?.send(JSON.stringify({ type: "subscribe", resource }));
    };

    if (this.isOpen()) {
      sendSubscribe();
    } else {
      this.connect()
        .then(() => {
          sendSubscribe();
        })
        .catch((err) => {
          console.warn(`WS Subscribe: Could not connect for resource ${resource}`, err);
        });
    };
  };

  public unsubscribe(resource: Resource): void {
    this.subs.delete(resource);

    if (this.isOpen()) {
      this.socket!.send(JSON.stringify({ type: "unsubscribe", resource }));
    };
  };

}
