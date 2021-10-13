import HtmlWebpackPlugin from 'html-webpack-plugin'

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
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      title: 'release_v0',
    }),
  ],
}