export type User = {
  name: string,
  id: number,
};

export type UserCreate = Omit<User, 'id'>;
