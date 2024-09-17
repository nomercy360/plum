/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  transpilePackages: ['next-image-export-optimizer'],
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
    path: 'https://assets.clanplatform.com',
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    nextImageExportOptimizer_imageFolderPath: 'public/images',
    nextImageExportOptimizer_exportFolderPath: 'out',
    nextImageExportOptimizer_quality: '75',
    nextImageExportOptimizer_storePicturesInWEBP: 'true',
    nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',

    // If you do not want to use blurry placeholder images, then you can set
    // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
    // `placeholder="empty"` to all <ExportedImage> components.
    nextImageExportOptimizer_generateAndUseBlurImages: 'true',

    // If you want to cache the remote images, you can set the time to live of the cache in seconds.
    // The default value is 0 seconds.
    nextImageExportOptimizer_remoteImageCacheTTL: '0',
  },
};

export default nextConfig;
