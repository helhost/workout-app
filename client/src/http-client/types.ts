export interface ClientConfig {
  baseURL?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions {
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
