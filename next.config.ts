import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  exportPathMap: async function (defaultPathMap) {
    return {
      "/": { page: "/" },
      "/login.html": { page: "/login" },
      "/signup.html": { page: "/signup" },
      "/users.html": { page: "/users" },

      // Define other custom routes here if needed
    };
  },
};

export default nextConfig;
