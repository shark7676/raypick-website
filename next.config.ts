import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  // pages from the previous site now live as sections of the home page
  async redirects() {
    return [
      { source: "/about", destination: "/#company", permanent: true },
      { source: "/services", destination: "/#apps", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
