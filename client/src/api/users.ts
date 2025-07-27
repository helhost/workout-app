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
    return this.client.get<User[]>("/")
  };
};

const usersAPI = new UsersAPI({ baseURL: `${import.meta.env.VITE_API_URL}/api/users` })
export default usersAPI
