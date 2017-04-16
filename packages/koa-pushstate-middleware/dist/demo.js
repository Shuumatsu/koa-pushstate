'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

app.use((0, _index2.default)(_path2.default.join(process.cwd(), 'public'), _index2.default.defaultResolveFilePath, {
  setHeaders: function setHeaders(res, path, stat) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  },
  index: _path2.default.join(process.cwd(), 'public', 'index.html'),
  fallthrough: false
}));

app.listen(5000, '0.0.0.0');
//# sourceMappingURL=demo.js.map