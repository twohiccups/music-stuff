import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  output: "export",
  basePath: "/music-stuff",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
