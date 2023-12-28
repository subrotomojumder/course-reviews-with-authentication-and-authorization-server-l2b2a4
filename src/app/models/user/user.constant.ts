export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
} as const;

export const USER_ROLE_ENUM: string[] = Object.values(USER_ROLE);;
