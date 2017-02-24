'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _detectPort = require('detect-port');

var _detectPort2 = _interopRequireDefault(_detectPort);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();
var opts = {
  key: _path2.default.resoleve(__dirname, 'key.pem'),
  cert: _path2.default.resolve(__dirname, 'cert.pem')
};

var directory = process.argv[2];
app.use((0, _index2.default)({ directory: directory }));

var server = _https2.default.createServer(opts, app.callback());

(0, _detectPort2.default)(5000).then(function (port) {
  if (port === 3000) {
    server.listen(port);
    return;
  }

  var question = _chalk2.default.yellow('Default port 5000 is in use. Change to another port?');

  prompt(question, true).then(function (change) {
    change && server.listen(port);
  });
});
//# sourceMappingURL=bin.js.map