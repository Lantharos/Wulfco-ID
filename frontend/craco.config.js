const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  reactScriptsVersion: "react-scripts",
  style: {
    css: {
      loaderOptions: () => {
        return {
          url: false,
        };
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Instantiate the TerserPlugin with desired options (if any)
      const terserPlugin = new TerserPlugin({
        terserOptions: {
          // Your Terser options here (if any)
          // For example:
          compress: {
            drop_console: true, // Drop console.log statements during minification
          },
          mangle: true, // Enable variable name mangling for obfuscation
          // ... (other Terser options)
        },
      });

      // Add TerserPlugin to the list of minifiers
      webpackConfig.optimization.minimizer = [
        terserPlugin,
        ...webpackConfig.optimization.minimizer,
      ];

      return webpackConfig;
    },
  },
};
