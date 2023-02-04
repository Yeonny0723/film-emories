require("dotenv").config();
const webpack = require("webpack");
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
    new webpack.EnvironmentPlugin({
      COOKIE_SECRET: JSON.stringify(process.env.COOKIE_SECRET),
      DB_URL: JSON.stringify(process.env.DB_URL),
      GH_CLIENT: JSON.stringify(process.env.GH_CLIENT),
      GH_SECRET: JSON.stringify(process.env.GH_SECRET),
      AWS_ID: JSON.stringify(process.env.AWS_ID),
      AWS_SECRET: JSON.stringify(process.env.AWS_SECRET),
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
