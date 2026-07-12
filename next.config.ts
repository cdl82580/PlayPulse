import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Google profile photos, shown as the account avatar for Google sign-ins.
    remotePatterns: [new URL("https://lh3.googleusercontent.com/**")],
  },
};

export default nextConfig;
