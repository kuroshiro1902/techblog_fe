// Cấu hình trong next.config.mjs
export const ENV = {
  SERVER_URL: process.env.SERVER_URL!,
  SOCKET_URL: process.env.SOCKET_URL!,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
  NEXT_AUTH_URL: process.env.NEXTAUTH_URL!,
};
