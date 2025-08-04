import { HttpClient } from "@/http-client";
import { WebSocketClient } from "@/ws-client";
import type { User, UserCreate, ClientConfig, callback } from "@/types";

class UsersAPI {
  private client: HttpClient
  private ws_client: WebSocketClient

  constructor(config: ClientConfig) {
    if (!config.baseURL) {
      throw new Error("baseURL is required to initialize UsersAPI");
    };

    this.client = new HttpClient(config);
    this.ws_client = new WebSocketClient(`${import.meta.env.VITE_API_URL}`);
  };

  public async connect() {
    this.ws_client.connect();
  };

  public async getUsers() {
    return this.client.get<User[]>("/")
  };

  public async createUser(data: UserCreate) {
    return this.client.post<User>("/", data)
  };

  public subscribeToUser(user_id: number, callback: callback): void {
    this.ws_client.subscribe(`users:${user_id}`, callback);
  };

  public unsubscribeFromUser(user_id: number): void {
    this.ws_client.unsubscribe(`users:${user_id}`);
  };
};

const usersAPI = new UsersAPI({ baseURL: `${import.meta.env.VITE_API_URL}/api/users` })
export default usersAPI
