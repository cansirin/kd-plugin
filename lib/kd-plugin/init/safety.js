var joinPath = require('path').join;

var fs = require('../../fs.js');
var CommandLineError = require('../../error/error.js');
var ErrENOENT = require('../../error/predicate/enoent.js');

module.exports = dontOverwriteExisting;

function dontOverwriteExisting() {
  var packageJson = joinPath(process.cwd(), 'package.json');

  return fs.statAsync(packageJson).then(function (exists) {
    if (exists) {
      throw new CommandLineError("Already initialized!");
    }
  })
  .catch(ErrENOENT, function () {/* silence ENOENT */});
}
