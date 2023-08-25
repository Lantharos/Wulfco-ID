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
      const terserPlugin = new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          mangle: true,
          output: { comments: false },
        },
      });

      webpackConfig.optimization.minimizer = [
        terserPlugin,
        ...webpackConfig.optimization.minimizer,
      ];

      return webpackConfig;
    },
  },
};
