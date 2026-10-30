import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;