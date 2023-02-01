const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/ts/";

module.exports = {
  entry: {
    main: BASE_JS + "main.ts",
    videoPlayer: BASE_JS + "videoPlayer.ts",
    upload: BASE_JS + "upload.ts",
    commentSection: BASE_JS + "commentSection.ts",
    profile: BASE_JS + "profile.ts",
    shared: BASE_JS + "shared.ts",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};

// 참고: https://vccolombo.github.io/blog/tsc-how-to-copy-non-typescript-files-when-building/
