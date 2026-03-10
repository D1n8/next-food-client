import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/shared/styles')],
    additionalData: `@import "@styles/mixins.scss";`,
    silenceDeprecations: ['import', 'legacy-js-api']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'front-school.minio.ktsdev.ru',
      },
    ],
  },
};

export default nextConfig;