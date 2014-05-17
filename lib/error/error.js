var inherits = require('util').inherits;

inherits(CommandLineError, Error);

module.exports = CommandLineError;

function CommandLineError(message) {
  Error.call(this);
  this.message = message;
}
