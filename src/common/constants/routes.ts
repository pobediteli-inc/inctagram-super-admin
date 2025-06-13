export const ROUTES = {
  user: (userId: number) => `/user/${userId}`,
  usersList: "/users-list",
} as const;
