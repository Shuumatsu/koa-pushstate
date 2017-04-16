#!/usr/bin/env node
'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _detectPort = require('detect-port');

var _detectPort2 = _interopRequireDefault(_detectPort);

var _koaPushstateMiddleware = require('koa-pushstate-middleware');

var _koaPushstateMiddleware2 = _interopRequireDefault(_koaPushstateMiddleware);

var _prompt = require('react-dev-utils/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();
var opts = {
  key: _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../key.pem')),
  cert: _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../cert.pem'))
};

var root = process.argv[2] || '.';
app.use(root, _koaPushstateMiddleware2.default.defaultResolveFilePath, {
  setHeaders: function setHeaders(res, path, stat) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  },
  index: _path2.default.join(root, 'index.html'),
  fallthrough: false
});

var server = _https2.default.createServer(opts, app.callback());
var runServer = function runServer(port) {
  server.listen(port, '0.0.0.0');
  console.log(_chalk2.default.yellow('Server is running https://localhost:' + port));
};

(0, _detectPort2.default)(5000).then(function (port) {
  if (port === 5000) {
    runServer(port);
    return;
  }

  var question = _chalk2.default.yellow('Default port 5000 is in use. Change to another port?');

  (0, _prompt2.default)(question, true).then(function (change) {
    change && runServer(port);
  });
});
//# sourceMappingURL=index.js.map