import { HttpClient } from "../http-client"
import type { ClientConfig } from "../http-client/types"

type User = {
  name: string,
  id: number,
};

class UsersAPI {
  private client: HttpClient

  constructor(config: ClientConfig) {
    this.client = new HttpClient(config)
  };

  public async getUsers() {
    return this.client.get<{ "users": User[] }>("/")
  };
};

const usersAPI = new UsersAPI({ baseURL: "http://localhost:8080/api/users" })
export default usersAPI
