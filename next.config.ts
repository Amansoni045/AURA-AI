import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Required to silence the workspace root warning as per Next.js 16 recommendation
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
