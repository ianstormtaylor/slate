'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _unknown = require('./unknown');

var _unknown2 = _interopRequireDefault(_unknown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function createInline(tagName, attributes, children) {
    var key = attributes.key,
        data = _objectWithoutProperties(attributes, ['key']);

    return (0, _unknown2.default)(tagName, {
        kind: 'inline',
        key: key,
        data: data
    }, children);
}

exports.default = createInline;