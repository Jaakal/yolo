const path = require('path');
const { jsonImporter } = require('./build-tools/json-importer');
const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    importer: jsonImporter,
    additionalData: (content, loaderContext) => {
      const { resourcePath, rootContext } = loaderContext;
      const relativePath = path.relative(rootContext, resourcePath);

      if (
        relativePath.includes('styles') ||
        relativePath.includes('globals.scss')
      ) {
        return content;
      }

      return `@use 'src/styles/utils' as *;${content}`;
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|webm)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]',
      },
    });

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
