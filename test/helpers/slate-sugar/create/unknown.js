'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slate = require('../../../..');

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function createTextNodes(children) {
    return children.map(function (child) {
        return (typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object' ? child : (0, _text2.default)('text', {}, [child]);
    });
}

function createUnknown(tagName, attributes, children) {
    var kind = attributes.kind,
        key = attributes.key,
        otherAttributes = _objectWithoutProperties(attributes, ['kind', 'key']);

    switch (kind) {
        case 'state':
            return _slate.State.create({
                document: children[0]
            }, attributes);
        case 'document':
            return _slate.Document.create(_extends({
                nodes: createTextNodes(children)
            }, attributes));
        case 'block':
            return _slate.Block.create(_extends({
                type: tagName,
                key: key,
                nodes: createTextNodes(children)
            }, otherAttributes));
        case 'inline':
            return _slate.Inline.create(_extends({
                type: tagName,
                key: key,
                nodes: createTextNodes(children)
            }, otherAttributes));
        case 'text':
            {
                var _attributes$marks = attributes.marks,
                    marks = _attributes$marks === undefined ? _slate.Mark.createSet([]) : _attributes$marks;

                var text = _slate.Text.create([{ text: children.join(''), marks: marks }]);
                return text.set('key', key || text.key);
            }
        default:
            throw new Error('Cannot create Node of unknown kind ' + kind);
    }
}

exports.default = createUnknown;
