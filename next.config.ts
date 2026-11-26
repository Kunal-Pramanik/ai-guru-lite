import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uploaded textbook pages can be large; allow bigger request bodies through the proxy layer.
  experimental: {
    proxyClientMaxBodySize: "130mb",
  },
};

export default nextConfig;
