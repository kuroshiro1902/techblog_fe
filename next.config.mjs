import dotenv from 'dotenv';
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVER_URL: process.env.SERVER_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    NEXT_AUTH_URL: process.env.NEXTAUTH_URL,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: undefined,
        hostname: '**',
        pathname: '**',
        // port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://26.8.234.33:4537/:path*',
      },
    ];
  },
};

export default nextConfig;
