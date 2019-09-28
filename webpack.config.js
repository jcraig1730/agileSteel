const path = require('path');

module.exports = {
  entry: './client/src/components/App.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public'),
    library: 'Reservations',
  },
  module: {
    rules: [
      {
        test: /\.m?js$|\.m?jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  }
};