module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        type: "asset/source",
      });

      return webpackConfig;
    },
  },
};
