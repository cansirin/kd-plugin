var Promise = require('bluebird');
var joinPath = require('path').join;
var template = require('lodash.template');
var zipObject = require('lodash.zipobject');

var fs = require('../../../fs.js');

module.exports = initTplBoilerplate;

var ejsRe = /\.ejs$/;

function initTplBoilerplate(target) {
  var tplPath = joinPath(__dirname, '../../../../templates');

  return fs.readdirAsync(tplPath)

  .filter(function (filename) {
    return ejsRe.test(filename);
  })

  .then(function (tplFiles) {
    return Promise.map(tplFiles, function (tplFile) {
      return fs.readFileAsync(joinPath(tplPath, tplFile), 'utf-8');
    }).map(function (content) {
      return template(content, target);
    }).then(function (contents) {
      return zipObject(tplFiles, contents);
    });
  })

  .then(function (boilerplate) {
    return Promise.map(Object.keys(boilerplate), function (k) {
      var outFile = joinPath(process.cwd(), k.replace(ejsRe, ''));
      return fs.writeFileAsync(outFile, boilerplate[k], 'utf-8');
    });
  });
}
