import { usersAPI } from "@/api"
import { test, expect, describe } from "vitest"

describe("Users API Integration", () => {
  test("can fetch users from real API", async () => {
    await usersAPI.connect();
    const users = await usersAPI.getUsers();
    expect(users).toBeDefined()
    expect(Array.isArray(users)).toBeTruthy()

    if (users.length > 0) {
      expect(typeof users[0].id).toBe("number")
      expect(typeof users[0].name).toBe("string")
    };
  });
});
