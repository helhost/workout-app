import { HttpClient } from "@/http-client";
import { subscribeWS, unsubscribeWS, usersResource } from "@/ws-client";
import type { User, UserCreate, ClientConfig, SubscriptionCallback } from "@/types";

class UsersAPI {
  private client: HttpClient

  constructor(config: ClientConfig) {
    if (!config.baseURL) {
      throw new Error("baseURL is required to initialize UsersAPI");
    };

    this.client = new HttpClient(config);
  };

  public async getUsers(): Promise<User[]> {
    return this.client.get<User[]>("/")
  };

  public async createUser(data: UserCreate): Promise<User> {
    return this.client.post<User>("/", data)
  };

  public subscribeToUser(user_id: number, cb: SubscriptionCallback): () => void {
    const resource = usersResource(user_id);
    subscribeWS(resource, cb);
    return () => unsubscribeWS(resource);
  };
};

const usersAPI = new UsersAPI({ baseURL: `${import.meta.env.VITE_API_URL}/api/users` })
export default usersAPI
