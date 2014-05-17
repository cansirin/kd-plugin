module.exports = function ErrENOENT(err) {
  return err.code == 'ENOENT' || err.cause && err.cause.code === 'ENOENT';
};
