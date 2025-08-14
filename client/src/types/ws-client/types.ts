export interface WSMessage<T = unknown> {
  type?: string;
  resource: string;
  data?: T;
}

export type SubscriptionCallback<T = any> = (msg: WSMessage<T>) => void;

export type Resource = string;

export interface WebSocketLike {
  readyState: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;

  // Browser-style
  addEventListener?: (event: string, handler: (ev: any) => void, options?: any) => void;

  // Node 'ws'-style
  on?: (event: string, handler: (ev: any) => void) => void;
  once?: (event: string, handler: (ev: any) => void) => void;
}
