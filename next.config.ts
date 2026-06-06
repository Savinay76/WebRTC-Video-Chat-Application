import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Use webpack instead of turbopack for broader platform support
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
