import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      'streamex-sdk': 'commonjs streamex-sdk',
    })

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    })

    return config
  },
};

export default nextConfig;
