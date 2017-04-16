'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _send = require('send');

var _send2 = _interopRequireDefault(_send);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var defaultResolveFilePath = function defaultResolveFilePath(root, reqPath) {
  return _path2.default.join(root, reqPath).toLowerCase();
};

var middleware = function middleware(root, resolveFilePath, opts) {
  root = _path2.default.resolve(root);

  if (!root) throw new Error('koa-pushstate-middleware: root is required');

  if (typeof resolveFilePath !== 'function') throw new Error('koa-pushstate-middleware: resolveFilePath option should be a function');

  return function () {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      var setHeaders = opts.setHeaders,
          fallthrough = opts.fallthrough,
          index = opts.index;


      var req = ctx.request;
      var res = ctx.response;

      // method not allowed
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (fallthrough) return next();

        res.status = 405;
        res.set({
          'Allow': 'GET, HEAD',
          'Content-Length': '0'
        });
        return;
      }

      var normalizedPath = _path2.default.normalize(req.path);
      var filepath = resolveFilePath(root, normalizedPath);
      var ext = _path2.default.extname(filepath);

      if (ext === '' || ext === '.html') {
        filepath = _path2.default.resolve(root, index);
        ext = '.html';
      }

      res.type = ext;
      var stream = (0, _send2.default)(req, filepath, opts);

      setHeaders && stream.on('headers', setHeaders);

      var forwardError = false;
      stream.on('file', function () {
        // once file is determined, always forward error
        forwardError = true;
      });

      stream.on('error', function (err) {
        if (forwardError || err.statusCode >= 500) throw err;

        next();
      });

      res.body = stream;
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

middleware.defaultResolveFilePath = defaultResolveFilePath;

exports.default = middleware;
//# sourceMappingURL=index.js.map