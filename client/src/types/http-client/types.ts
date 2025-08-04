export interface ClientConfig {
  baseURL?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type callback = (message: { type: string, data: any }) => void;
