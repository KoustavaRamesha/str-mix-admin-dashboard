
import type {NextConfig} from 'next';

// Extract Supabase hostname from env for image remote patterns
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ujgolmqhsapzksdwzbxn.supabase.co';
const supabaseHostname = new URL(supabaseUrl).hostname;

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // Pre-existing type errors with animation libraries (framer-motion v12 + motion package compatibility)
  },
  eslint: {
    ignoreDuringBuilds: true, // Prevents build blocking on legacy rules
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', '@radix-ui/react-icons'],
    serverExternalPackages: ['genkit', '@genkit-ai/google-genai', '@genkit-ai/firebase', 'uuid'],
  },
  images: {
    // Prevent DoS via unbounded cache growth (GHSA-3x4c-7xq6-9pq8)
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: supabaseHostname,
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Security headers to prevent common vulnerabilities
  // CSP is now handled by middleware.ts for dynamic nonce support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevent MIME type sniffing
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Prevent clickjacking
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Legacy XSS protection
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Control referrer leakage
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=()', // Restrict API access
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains', // Enforce HTTPS
          },
        ],
      },
    ];
  },
};

export default nextConfig;

