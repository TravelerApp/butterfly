const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          // this query below was added so that we can use object spread operator not really sure if it belongs here but it seems to work  ¯\_(ツ)_/¯
          query: {
            plugins:[ 'transform-object-rest-spread' ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: "image-webpack-loader",
        // Specify enforce: 'pre' to apply the loader
        // before url-loader/svg-url-loader
        // and not duplicate it in rules with them
        enforce: "pre"
      }
    ]
  },
  plugins: [htmlPlugin],
  node: {
    console: true,
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};
