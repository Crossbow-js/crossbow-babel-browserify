var fs         = require('fs');
var browserify = require('browserify');
var babelify   = require('babelify');
var exorcist   = require('exorcist');
var dirname    = require('path').dirname;

/**
 * Define the tasks that make up a build
 * @type {Object}
 */
var tasks    = [processJS];

/**
 * Process JS with babel + browserify
 * @param deferred
 * @param previous
 * @param ctx
 */
function processJS (deferred, previous, ctx) {

    var input  = ctx.path.make('babel-browserify', 'input');
    var root   = ctx.path.make('babel-browserify', 'root');
    var output = ctx.path.make('babel-browserify', 'output');
    var map    = output + '.map';

    ctx.mkdirp.sync(dirname(output));

    browserify(input, { debug: true })
        .transform(babelify.configure({
            sourceMapRelative: root
        }))
        .bundle()
        .on('error', function (err) {
            console.log(err.codeFrame);
            deferred.reject(err);
        })
        .pipe(exorcist(map))
        .pipe(fs.createWriteStream(output))
        .on('close', deferred.resolve)
}

/**
 * Also Export BrowserSync instance
 * @type {Object|*}
 */
module.exports.tasks = tasks;