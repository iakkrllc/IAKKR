import type { NextConfig } from "next";

// Windows + this Next.js version hits a native worker-process crash
// (STATUS_STACK_BUFFER_OVERRUN) during static page generation when using
// more than one build worker. Vercel builds on Linux and isn't affected, so
// this restriction only applies to local Windows builds.
const isWindows = process.platform === "win32";

const nextConfig: NextConfig = {
  experimental: isWindows ? { cpus: 1, workerThreads: false } : {},
};

export default nextConfig;
