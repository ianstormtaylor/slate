'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _block = require('../models/block');

var _block2 = _interopRequireDefault(_block);

var _document = require('../models/document');

var _document2 = _interopRequireDefault(_document);

var _state = require('../models/state');

var _state2 = _interopRequireDefault(_state);

var _text = require('../models/text');

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Deserialize a plain text `string` to a state.
 *
 * @param {String} string
 * @return {State}
 */

function deserialize(string) {
  return _state2.default.create({
    document: _document2.default.create({
      nodes: string.split('\n').map(deserializeLine)
    })
  });
}

/**
 * Deserialize a `line` of text.
 *
 * @param {String} line
 * @return {Block}
 */

function deserializeLine(line) {
  return _block2.default.create({
    type: 'line',
    nodes: [_text2.default.create({
      characters: line.split('').map(deserializeCharacter)
    })]
  });
}

/**
 * Deserialize a `character`.
 *
 * @param {String} char
 * @return {Character}
 */

function deserializeCharacter(char) {
  return { text: char };
}

/**
 * Serialize a `state` to plain text.
 *
 * @param {State} state
 * @return {String}
 */

function serialize(state) {
  return state.document.nodes.map(function (block) {
    return block.text;
  }).join('\n');
}

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = {
  deserialize: deserialize,
  serialize: serialize
};