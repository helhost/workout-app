import type { ClientConfig, HttpMethod } from "./types"
import { HttpError } from "./errors"

export class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ClientConfig) {
    this.baseURL = config.baseURL || "";
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = config.defaultHeaders || {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
  };

  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(
      endpoint, "GET", headers
    );
  };

  public async post<T>(endpoint: string, headers?: Record<string, string>, data?: any): Promise<T> {
    return this.makeRequest<T>(
      endpoint, "POST", headers, data
    );
  };

  public async put<T>(endpoint: string, headers?: Record<string, string>, data?: any): Promise<T> {
    return this.makeRequest<T>(
      endpoint, "PUT", headers, data
    )
  }

  public async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(
      endpoint, "DELETE", headers
    );
  };

  public async patch<T>(endpoint: string, headers?: Record<string, string>, data?: any): Promise<T> {
    return this.makeRequest<T>(
      endpoint, "PATCH", headers, data
    );
  };

  public async makeRequest<T>(
    endpoint: string,
    method: HttpMethod,
    headers?: Record<string, string>,
    body?: any
  ): Promise<T> {

    const controller = new AbortController()
    const url = `${this.baseURL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    const response = await fetch(url, {
      signal: controller.signal,
      method: method,
      headers: {
        ...this.defaultHeaders,
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json()

      if (Array.isArray(errorData.detail)) {
        const message = errorData.detail.map((err: any) => err.msg || "").join(", ")
        throw new HttpError(response.status, message)
      };

      throw new HttpError(response.status, errorData.detail || "Unknown Error");
    }

    const data = await response.json();
    return data
  };
};
