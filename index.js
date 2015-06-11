var path       = require('path');
var ctx        = require('crossbow-ctx')();
var prom       = require('prom-seq');
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
var builder  = prom.create(tasks);

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
    var map    = ctx.path.make('babel-browserify', 'sourcemap');

    ctx.mkdirp.sync(dirname(output));


    browserify(input, { debug: true })
        .transform(babelify.configure({
            sourceMapRelative: root
        }))
        .bundle()
        .pipe(exorcist(map))
        .on("error", deferred.reject)
        .pipe(fs.createWriteStream(output))
        .on('close', deferred.resolve)
        .on("error", deferred.reject)
}

if (!module.parent) {
    builder('', ctx)
        .progress(function (obj) {
            console.log(obj.msg);
        })
        .catch(function (err) {
            throw err;
        }).done();
}

/**
 * Also Export BrowserSync instance
 * @type {Object|*}
 */
module.exports = builder;
module.exports.tasks = tasks;