import dotenv from 'dotenv';
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVER_URL: process.env.SERVER_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    NEXT_AUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*',
        pathname: '**',
        port: '',
      },
    ],
  },
};

export default nextConfig;
