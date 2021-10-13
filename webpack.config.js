const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')

module.exports = {
  entry: {
    main: './src/index.js'
  },
  devServer: {
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-react-jsx']
          }
        }
      }
    ]
  },
  mode: "development",
  optimization: {
    minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React',
      template: path.join(__dirname, 'src/index.html') // 源模板文件
    }),
  ],
}