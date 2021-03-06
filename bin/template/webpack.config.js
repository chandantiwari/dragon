var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
    path                = require('path'),
    webpack             = require('webpack')

module.exports = {

  entry: {
    vendor: [
      'handlebars',
      'joi',
      'moment'
    ],
    app: [
      './app/index.js'
    ]
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, './public/js')
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        //exclude: /node_modules/,
        query: {
          blacklist: [
            'useStrict'
          ],
          optional: [
            'es7.classProperties',
            //'es7.decorators',
            /*
            TODO: Figure out why the runtime isn't working
            */
            //'runtime'
          ],
          //stage: 0
        }
      },
      { test: /\.hbs$/, loader: 'handlebars-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },

  /*node: {
    dns: 'mock',
    net: 'mock'
  },*/

  resolve: {
    root: path.join(__dirname, './app'),
    extensions: ['', '.hbs', '.js', '.json'],
    alias: {
      'handlebars': 'handlebars/runtime.js'
    }
  },

  resolveLoader: {
    root: path.join(__dirname, './node_modules')
  },

  plugins: [
    new webpack.IgnorePlugin(/node_modules\/^paradigm/),
    new webpack.NormalModuleReplacementPlugin(/^(net|dns)$/, path.resolve(__dirname, 'shims/blank.js')),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new ChunkManifestPlugin({
      filename: "manifest.json",
      manifestVariable: "webpackManifest"
    })
  ]
}
