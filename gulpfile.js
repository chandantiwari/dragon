process.on('uncaughtException', console.log)
process.on('unhandledRejection', function(reason, p) {

    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason)
    // application specific logging, throwing an error, or other logic here

})

var babelify       = require('babelify'),
    browserify     = require('browserify'),
    concat         = require('gulp-concat'),
    glob           = require('glob'),
    gulp           = require('gulp'),
    mocha          = require('gulp-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    source         = require('vinyl-source-stream')

gulp.task('mocha-browser-build', function(done) {

  var testFiles   = glob.sync('./test/unit/**/*.js')
  var testHelpers = [
    './lib/polyfills/nodelist.queryselectorall.js',
    './test/helpers/browser/js/runner.js'
  ]

  var sources = testHelpers.concat(testFiles)

  var bundler = browserify({
    bundleExternal: true,
    cache: {},
    debug: true,
    entries: sources,
    extensions: [],
    fullPaths: true,
    insertGlobals: false,
    packageCache: {}
  })

  bundler
    .transform(babelify.configure({
      blacklist: ["useStrict"]
    }))
    .bundle()
    .on('error', function() {
      console.log(arguments)
    })
    .pipe(source('spec.js'))
    .pipe(gulp.dest('test/helpers/browser/js'))
    .on('end', function() {
      console.log('test/helpers/browser/js/spec.js created.')
      done()
    })

})

gulp.task('mocha-browser-run', ['mocha-browser-build'], function() {

  return gulp
    .src('./test/helpers/browser/runner.html')
    .pipe(mochaPhantomJS({reporter: 'spec'}))

})

gulp.task('mocha-cli', function() {

  return gulp
    .src([
      './test/helpers/cli/runner.js',
      './lib/polyfills/**/*.js',
      './test/unit/**/*.js'
    ], {read: false})
    .pipe(mocha({reporter: 'spec'}))

})

gulp.task('t', [
  //'mocha-cli',
  'mocha-browser-run'
])
