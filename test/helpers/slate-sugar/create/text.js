'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('../../../..');

var _unknown = require('./unknown');

var _unknown2 = _interopRequireDefault(_unknown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createText(tagName, _ref, children) {
    var _ref$marks = _ref.marks,
        marks = _ref$marks === undefined ? [] : _ref$marks,
        key = _ref.key;

    marks = _slate.Mark.createSet(marks.map(function (mark) {
        return typeof mark === 'string' ? { type: mark } : mark;
    }));
    return (0, _unknown2.default)(tagName, {
        kind: 'text',
        key: key,
        marks: marks
    }, children);
}

exports.default = createText;
