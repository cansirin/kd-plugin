var Promise = require('bluebird');
var read = Promise.promisify(require('read'));
var joinPath = require('path').join;

var CommandLineError = require('../../error/error.js');

module.exports = collectInput;

function collectInput(target) {
  return read({ prompt: 'plugin name:' })

  .spread(function (name) {
    target.name = name;
    target.srcPath = joinPath(process.cwd(), 'src', name);
    return read({ prompt: 'description:' });
  })

  .spread(function (description) {
    target.description = description;
    return read({ prompt: 'license:', default: 'MIT' });
  })

  .spread(function (license) {
    target.license = license;
    console.log(target); // NOTE: not for debugging!
    return read({ prompt: 'ok?', default: 'yes' });
  })

  .spread(function (ok) {
    if (!ok || ok.toLowerCase().charAt(0) !== 'y') {
      throw new CommandLineError("Aborted!");
    }
  });
}
