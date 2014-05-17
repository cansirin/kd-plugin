var Promise = require('bluebird');
var read = Promise.promisify(require('read'));
var path = require('path');

var CommandLineError = require('../../error/error.js');

var cwd = process.cwd();

module.exports = collectInput;

function collectInput(memo) {
  return read({ prompt: 'plugin name:', default: path.basename(cwd) })

  .spread(function (name) {
    memo.name = name;
    memo.srcPath = path.join(cwd, 'src', name);
    return read({ prompt: 'description:' });
  })

  .spread(function (description) {
    memo.description = description;
    return read({ prompt: 'license:', default: 'MIT' });
  })

  .spread(function (license) {
    memo.license = license;
    console.log(memo); // NOTE: not for debugging!
    return read({ prompt: 'ok?', default: 'yes' });
  })

  .spread(function (ok) {
    if (!ok || ok.toLowerCase().charAt(0) !== 'y') {
      throw new CommandLineError("Aborted!");
    }
  });
}
