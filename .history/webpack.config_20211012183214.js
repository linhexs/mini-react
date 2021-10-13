module.exports = {
  entry: {
    main: './src/index.js'
  },
  devServer: {
    contentBase: './dist',
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
  }
}