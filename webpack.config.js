/*
config for webpack. Will be used in
the Gulpfile for building our app.
Does not need gulp in order to do so,
but we use gulp to orchestrate
 */
module.exports = {
  output: {
    filename: 'bundle.js'
  },

  devtool: 'sourcemap',
// TODO: create loader for .js filest ransfroming from ES2015 to ES5

  module: {
    loaders: [
      { test: /\.html$/, loader: 'raw' },
       { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.scss$/,loaders: ["style", "css", "sass"]},
      { test: /\.(woff|woff2|eot|ttf|svg)$/, loader:'url'},
      { test: /\.(png|jpg|jpeg)$/, loader: 'file' },
      { test: /\.xml$/, loader: 'xml-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.js$/, loader: 'babel?stage=1', exclude: [/client\/lib/, /node_modules/,/server/,/\.spec\.js/] }
    ]
  },

  stylus: {
    use: [require('jeet')(), require('rupture')()]
  },
  sassLoader: {
    includePaths: [require('path').resolve(__dirname, "./client/style/sass")]
  }
};
