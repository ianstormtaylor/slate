'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slate = require('../../..');

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function addNodeCreators(typeMap, createNode, initialValue) {
    return Object.keys(typeMap).reduce(function (acc, key) {
        var tagName = key;
        var type = typeMap[key];
        return _extends(_defineProperty({}, tagName, function (_) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return createNode.apply(undefined, [type].concat(args));
        }), acc);
    }, initialValue);
}

function isChild(child) {
    return typeof child === 'string' || typeof child === 'number' || Array.isArray(child) || child instanceof _slate.State || child instanceof _slate.Document || child instanceof _slate.Block || child instanceof _slate.Inline || child instanceof _slate.Text || child instanceof _slate.Mark;
}

function createHyperscript() {
    var groups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var nodeCreators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var defaultNodeCreators = {
        state: _create.createState,
        document: _create.createDocument,
        text: _create.createText,
        blocks: _create.createBlock,
        inlines: _create.createInline,
        marks: _create.createMark
    };
    nodeCreators = _extends({}, defaultNodeCreators, nodeCreators);

    // add a node creator for each items in the groups
    nodeCreators = Object.keys(groups).reduce(function (acc, group) {
        return addNodeCreators(groups[group], acc[group], acc);
    }, nodeCreators);

    return function (tagName, attributes) {
        for (var _len2 = arguments.length, children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            children[_key2 - 2] = arguments[_key2];
        }

        if (attributes == null) {
            attributes = {};
        }

        if (isChild(attributes)) {
            children = [attributes].concat(children);
            attributes = {};
        }

        // flatten children to allow passing them as an array
        children = children.reduce(function (acc, child) {
            return acc.concat(child);
        }, []);

        var createNode = nodeCreators.hasOwnProperty(tagName) ? nodeCreators[tagName] : _create2.default;

        return createNode(tagName, attributes, children);
    };
}

exports.default = createHyperscript;
