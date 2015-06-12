var bs   = require('/Users/shakyshane/code/browser-sync').create();
var cli  = require("./index");
var ctx  = require('crossbow-ctx')();
var prom = require('prom-seq');
var task = prom.create(cli.tasks);

bs.watch('test/fixtures/*.js').on('change', function (file) {
    console.log(file, 'changed');
    task('', ctx)
        .then(function () {
            console.log('Build complete');
        })
        .progress(function (msg) {
            console.log(msg.msg);
        })
        .catch(function (err) {
            console.log('err', err.message);
        })
        .done();
});