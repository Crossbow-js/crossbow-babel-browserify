var cli = require("./index");
var ctx = require("crossbow-ctx");

cli('', ctx()).then(function () {
    console.log("DONE");
}).done();