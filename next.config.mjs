import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [process.env.IP_ADDRESS],
};

export default nextConfig;
