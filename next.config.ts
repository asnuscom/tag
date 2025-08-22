import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Dynamic database kullandığımız için kaldırıldı
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
