import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@auth0/nextjs-auth0"],
  poweredByHeader: false,
};

export default nextConfig;
