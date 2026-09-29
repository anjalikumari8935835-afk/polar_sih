import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = process.env.AI_BACKEND_URL || "http://127.0.0.1:8000";
    return [{ source: "/api/ai/:path*", destination: `${backend}/api/:path*` }];
  },
};

export default nextConfig;
