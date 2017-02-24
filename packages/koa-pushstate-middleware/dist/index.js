'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mimeTypes = require('mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

var _koaPushstateUtils = require('koa-pushstate-utils');

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var debug = (0, _debug3.default)('koa-pushstate-middleware');

var defaultResolveFilePath = function defaultResolveFilePath(reqPath, directory) {
  var paths = (0, _koaPushstateUtils.ensureNoSlash)(reqPath).split('/');

  return _path2.default.resolve.apply(_path2.default, [directory].concat(_toConsumableArray(paths)));
};

exports.default = function (_ref) {
  var directory = _ref.directory,
      _ref$indexHtml = _ref.indexHtml,
      indexHtml = _ref$indexHtml === undefined ? 'index.html' : _ref$indexHtml,
      _ref$defer = _ref.defer,
      defer = _ref$defer === undefined ? false : _ref$defer,
      _ref$test = _ref.test,
      test = _ref$test === undefined ? /[\s\S]/ : _ref$test,
      _ref$resolveFilePath = _ref.resolveFilePath,
      resolveFilePath = _ref$resolveFilePath === undefined ? defaultResolveFilePath : _ref$resolveFilePath;

  if (!directory) throw new Error('koa-pushstate-middleware: directory option is required');

  if (typeof _path2.default !== 'string' && !_path2.default instanceof RegExp) throw new Error('koa-pushstate-middleware: path option should be a string or regx');

  if (typeof resolveFilePath !== 'function') throw new Error('koa-pushstate-middleware: resolveFilePath option should be a function');

  return function () {
    var _ref2 = _asyncToGenerator(function* (ctx, next) {
      debug('ctx.path: ' + ctx.path);

      var reqPath = ctx.path;
      if (typeof test === 'string' && !reqPath.startsWith(test)) return yield next();
      if (test instanceof RegExp && !test.test(reqPath)) return yield next();

      if (defer) yield next();

      var req = ctx.request;
      var resp = ctx.response;

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        resp.status = 403;
        resp.set('Allow', 'GET, HEAD');
        resp.set('Content-Length', '0');
        return;
      }

      var filepath = resolveFilePath(reqPath, directory);
      var ext = _path2.default.extname(filepath);

      if (ext === '' || ext === '.html') {
        filepath = _path2.default.resolve(directory, indexHtml);
        ext = '.html';
      }

      debug('filepath: ' + filepath);

      // detect file
      var stats = void 0,
          gzPath = void 0;
      try {
        stats = yield (0, _koaPushstateUtils.fileStats)(filepath + '.gz');
        gzPath = filepath + '.gz';
      } catch (err) {
        debug('try to serve gz ver: ' + err);
      }

      if (!stats) {
        try {
          stats = yield (0, _koaPushstateUtils.fileStats)(filepath);
        } catch (err) {
          debug('not found: ' + err);
          resp.status = 404;
          yield next();
          return;
        }
      }

      filepath = gzPath || filepath;

      // const type = mime.lookup(filepath)
      // const charset = mime.charsets.lookup(type)
      // resp.set('Content-Type', `${type}${charset ? `; charset=${charset}` : ''}`)
      resp.set('Content-Type', _mimeTypes2.default.contentType(ext));
      resp.set('Content-Length', stats.size);

      // write to resp
      resp.body = _fs2.default.createReadStream(filepath);

      if (!defer) yield next();
    });

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};
//# sourceMappingURL=index.js.map