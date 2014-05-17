var Promise = require('bluebird');
var mkdirp = Promise.promisify(require('mkdirp'));
var touch = Promise.promisify(require('touch'));
var joinPath = require('path').join;

module.exports = initSrcBoilerplate;

function initSrcBoilerplate(target) {
  return mkdirp(target.srcPath).then(function () {
    return touch(joinPath(target.srcPath, target.name + '.coffee'));
  });
}
