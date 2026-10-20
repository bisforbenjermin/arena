import withPWA from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default withPWA({
  dest: 'public',
  customWorkerSrc: 'worker',
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
