'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileStats = exports.ensureFile = exports.ensureNoSlash = exports.errFirstCallbackToPromise = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fp = require('lodash/fp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errFirstCallbackToPromise = exports.errFirstCallbackToPromise = function errFirstCallbackToPromise(fn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      var callback = function callback(err) {
        for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          values[_key2 - 1] = arguments[_key2];
        }

        if (err) {
          reject(err);
          return;
        }

        values.length > 1 ? resolve(values) : resolve.apply(undefined, values);
      };

      (0, _fp.partialRight)(fn)([callback]).apply(undefined, args);
    });
  };
};

var ensureNoSlash = exports.ensureNoSlash = function ensureNoSlash(path) {
  path.startsWith('/') && (path = path.slice(1));
  path.endsWith('/') && (path = path.slice(0, -1));

  return path;
};

var ensureFile = exports.ensureFile = function ensureFile(filepath) {
  return errFirstCallbackToPromise(_fs2.default.access)(filepath, _fs2.default.constants.R_OK);
};

var fileStats = exports.fileStats = function fileStats(filepath) {
  return errFirstCallbackToPromise(_fs2.default.stat)(filepath);
};
//# sourceMappingURL=index.js.map