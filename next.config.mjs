/** @type {import('next').NextConfig} */

import { NextFederationPlugin } from '@module-federation/nextjs-mf';

const remotes = (isServer) => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    remote: `remote@${process.env.REMOTE_URL}/_next/static/${location}/remoteEntry.js`,
  };
};

const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        remotes: remotes(isServer),
        exposes: {},
        shared: {
          'styled-components': {
            eager: true,
            singleton: true,
            requiredVersion: '^6.1.8',
          },
        },
      })
    );

    return config;
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
