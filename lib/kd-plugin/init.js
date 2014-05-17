var Promise = require('bluebird');
var read = Promise.promisify(require('read'));
var touch = Promise.promisify(require('touch'));
var mkdirp = Promise.promisify(require('mkdirp'));
var fs = Promise.promisifyAll(require('fs'));
var joinPath = require('path').join;
var template = require('lodash.template');
var zipObject = require('lodash.zipobject');
var color = require('cli-color');

var tplPath = joinPath(__dirname, '../../templates');
var ejsRe = /\.ejs$/;

Promise.bind({})

.then(function () {
  var packageJson = joinPath(process.cwd(), 'package.json');
  return fs.statAsync(packageJson);
})

.then(function (exists) {
  if (exists) {
    throw new Error("Already initialized!");
  }
})

.catch(ErrENOENT, function () {/* silence ENOENT */})

.then(function () {
  return read({ prompt: 'plugin name:' });
})

.spread(function (name) {
  this.name = name;
  this.srcPath = joinPath(process.cwd(), 'src', name);
  return read({ prompt: 'description:' });
})

.spread(function (description) {
  this.description = description;
  return read({ prompt: 'license:', default: 'MIT' });
})

.spread(function (license) {
  this.license = license;
  console.log(this);
  return read({ prompt: 'ok?', default: 'yes' })
})

.spread(function (ok) {
  if (!ok || ok.toLowerCase().charAt(0) !== 'y') {
    throw new Error("Aborted!")
  }
  return mkdirp(this.srcPath);
})

.then(function () {
  return touch(joinPath(this.srcPath, this.name + '.coffee'));
})

.then(function () {
  return fs.readdirAsync(tplPath)
})

.then(function (listing) {
  return listing.filter(function (f) {
    return ejsRe.test(f);
  });
})

.then(function (tplFiles) {
  return Promise.all(tplFiles.map(function (tplFile) {
    return fs.readFileAsync(joinPath(tplPath, tplFile), 'utf-8');
  })).map(function (content) {
    return template(content, this);
  }.bind(this)).then(function (contents) {
    return zipObject(tplFiles, contents);
  });
})

.then(function (boilerplate) {
  return Promise.map(Object.keys(boilerplate), function (k) {
    var outFile = joinPath(process.cwd(), k.replace(ejsRe, ''));
    return fs.writeFileAsync(outFile, boilerplate[k], 'utf-8');
  });
})

.catch(function (err) {
  console.log(color.red(err.message));
});

function ErrENOENT(err) {
  return err.cause && err.cause.code === 'ENOENT';
}
