var Promise = require('bluebird');
var read = Promise.promisify(require('read'));
var joinPath = require('path').join;

var CommandLineError = require('../../error/error.js');

module.exports = collectInput;

function collectInput(memo) {
  return read({ prompt: 'plugin name:' })

  .spread(function (name) {
    memo.name = name;
    memo.srcPath = joinPath(process.cwd(), 'src', name);
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
