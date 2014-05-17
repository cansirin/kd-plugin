var Promise = require('bluebird');
var color = require('cli-color');

var CommandLineError = require('../../error/error.js');
var safetyFirst = require('./safety.js');
var collectInput = require('./collect.js');
var initSrcBoilerplate = require('./boilerplate/src.js');
var initTplBoilerplate = require('./boilerplate/tpl.js');

module.exports = initialize;

function initialize() {
  return safetyFirst().bind({})

  .then(function() {
    return collectInput(this);
  })

  .then(function () {
    return Promise.all([
      initSrcBoilerplate(this),
      initTplBoilerplate(this)
    ]);
  })

  .catch(CommandLineError, function (err) {
    console.log(color.red(err.message));
  });
}
