export const ROUTES = {
  user: (userId: number) => `/user/${userId}`,
  usersList: "/users-list",
  signInAdmin: "/sign-in-admin",
  publicUser: (userId: number) => `/public-user/${userId}`,
} as const;
