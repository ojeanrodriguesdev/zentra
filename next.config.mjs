/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações para performance
  compress: true,
  
  // Desabilitar source maps completamente para evitar 404s
  productionBrowserSourceMaps: false,
  
  // Configurações experimentais
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Configuração do Webpack para eliminar source maps e warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = false; // Desabilita source maps completamente
    }
    
    // Configurar para ignorar arquivos map inexistentes
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
  
  // Headers para otimização de recursos
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;