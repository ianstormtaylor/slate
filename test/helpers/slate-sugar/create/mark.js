'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMark(tagName, attributes, children) {
    var marks = [{
        type: tagName,
        data: attributes
    }];
    return (0, _text2.default)(tagName, { marks: marks }, children);
}

exports.default = createMark;