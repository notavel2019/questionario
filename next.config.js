/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.agencianotavel.com.br',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // pdfjs-dist (build legacy) referencia 'canvas' opcionalmente para renderização
    // gráfica em Node; usamos apenas extração de texto, então descartamos o módulo.
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    if (isServer) {
      config.externals = [...(config.externals || []), 'bwip-js'];
    }
    return config;
  },
};

module.exports = nextConfig;
