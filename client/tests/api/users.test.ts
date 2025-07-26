import usersAPI from "../../src/api/users"
import { test, expect } from "vitest"

test("can fetch users from real API", async () => {
  const users = await usersAPI.getUsers();
  expect(users).toBeDefined()
  console.log(users.users)
  expect(Array.isArray(users.users)).toBeTruthy()

  if (users.users.length > 0) {
    expect(typeof users.users[0].id).toBe("number")
    expect(typeof users.users[0].name).toBe("string")
  };

})
