// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const fs = require("fs");

const isProduction = process.env.NODE_ENV == "production";

class CopyToTargetPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("CopyToTargetPlugin", (stats) => {
      if (stats.hasErrors()) {
          console.log("[CopyToTargetPlugin] Build has errors, skipping copy.");
          return;
      }
      const targetDir = "C:\\betterncm\\plugins_dev\\mytheme";
      const distDir = path.resolve(__dirname, "dist");

      if (!fs.existsSync(targetDir)) {
        try {
            fs.mkdirSync(targetDir, { recursive: true });
        } catch (e) {
            console.error("[CopyToTargetPlugin] Failed to create target directory:", e);
            return;
        }
      }

      const copyRecursiveSync = (src, dest) => {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
            }
            fs.readdirSync(src).forEach((childItemName) => {
                copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
      };

      try {
        if (fs.existsSync(distDir)) {
            const files = fs.readdirSync(distDir);
            files.forEach((file) => {
                const srcFile = path.join(distDir, file);
                const destFile = path.join(targetDir, file);
                copyRecursiveSync(srcFile, destFile);
                console.log(`[CopyToTargetPlugin] Copied ${file} to ${targetDir}`);
            });
        }
      } catch (err) {
        console.error("[CopyToTargetPlugin] Error copying files:", err);
      }
    });
  }
}

/*const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";*/

const stylesHandler = "style-loader";

const config = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new copyWebpackPlugin({
        patterns: [
            {
              from: path.resolve(__dirname, "src", "manifest.json"),
              to: path.resolve(__dirname, "dist", "manifest.json"),
            },
            {
              from: path.resolve(__dirname, "src", "assets"),
              to: path.resolve(__dirname, "dist", "assets"),
            }
        ]
    }),
    // new BundleAnalyzerPlugin()

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new CopyToTargetPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      /*{
        test: /settings-menu\.html/i,
        type: "asset/source"
      }*/

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  
  experiments: {
      topLevelAwait: true
  },

  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    //config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
  }
  
  
  return config;
};
