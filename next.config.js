/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remover estas configurações que são específicas para GitHub Pages
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
  // basePath: '/nome-do-repositorio',
}

module.exports = nextConfig 