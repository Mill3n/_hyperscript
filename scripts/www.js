var config = require('../package.json');
var fs = require('fs-extra');

var testRoot = "www/test/";
var currentReleaseRoot = testRoot + config.version;
fs.ensureDirSync(currentReleaseRoot);
fs.copySync("node_modules/mocha/mocha.js", currentReleaseRoot + "/node_modules/mocha/mocha.js");
fs.copySync("node_modules/mocha/mocha.css", currentReleaseRoot + "/node_modules/mocha/mocha.css");
fs.copySync("node_modules/chai/chai.js", currentReleaseRoot + "/node_modules/chai/chai.js");
fs.copySync("node_modules/sinon/pkg/sinon.js", currentReleaseRoot + "/node_modules/sinon/pkg/sinon.js");
fs.copySync("test/", currentReleaseRoot + "/test");
fs.copySync("src/", currentReleaseRoot + "/src");
fs.copySync("src/lib/core.js", "www/js/lib/core.js");
fs.copySync("src/lib/web.js", "www/js/lib/web.js");
fs.copySync("src/lib/worker.js", "www/js/lib/worker.js");
fs.copySync("src/lib/hdb.js", "www/js/lib/hdb.js");

var testHTML = "<html><body style='font-family: sans-serif'><h1>HTMX TESTS</h1><ul>\n"
fs.readdirSync(testRoot).reverse().forEach(function(file){
    if (file !== "index.html") {
        testHTML += "<li><a href='/test/" + file + "/test'>" + file + "</a>\n";
    }
});
testHTML += "</ul></body>"
fs.writeFileSync(testRoot + "/index.html", testHTML);
