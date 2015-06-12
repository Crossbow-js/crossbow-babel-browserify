var cli    = require("./index");
var del    = require('rimraf').sync;
var assert = require('assert');
var exists = require('fs').existsSync;
var prom   = require('prom-seq');

del('test/fixtures/dist');

var task = prom.create(cli.tasks);

task('', require('crossbow-ctx')()).then(function () {
    assert(exists('test/fixtures/dist/app.js'));
    assert(exists('test/fixtures/dist/app.js.map'));
    console.log('Build complete');
}).done();