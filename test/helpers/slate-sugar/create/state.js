'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _unknown = require('./unknown');

var _unknown2 = _interopRequireDefault(_unknown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createState(tagName, attributes, children) {
    return (0, _unknown2.default)(tagName, _extends({
        kind: 'state'
    }, attributes), children);
}

exports.default = createState;