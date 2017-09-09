'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.create = undefined;

var _create = require('./create');

Object.defineProperty(exports, 'create', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_create).default;
  }
});
Object.keys(_create).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _create[key];
    }
  });
});

var _createHyperscript = require('./createHyperscript');

var _createHyperscript2 = _interopRequireDefault(_createHyperscript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _createHyperscript2.default;