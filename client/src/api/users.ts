import { HttpClient } from "../http-client"
import type { User, UserCreate, ClientConfig } from "@/types"

class UsersAPI {
  private client: HttpClient

  constructor(config: ClientConfig) {
    this.client = new HttpClient(config)
  };

  public async getUsers() {
    return this.client.get<User[]>("/")
  };

  public async createUser(data: UserCreate) {
    return this.client.post<User>("/", data)
  };
};

const usersAPI = new UsersAPI({ baseURL: `${import.meta.env.VITE_API_URL}/api/users` })
export default usersAPI
