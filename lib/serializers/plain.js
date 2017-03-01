'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _raw = require('../serializers/raw');

var _raw2 = _interopRequireDefault(_raw);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Deserialize a plain text `string` to a state.
 *
 * @param {String} string
 * @param {Object} options
 *   @property {Boolean} toRaw
 * @return {State}
 */

function deserialize(string) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var raw = {
    kind: 'state',
    document: {
      kind: 'document',
      nodes: string.split('\n').map(function (line) {
        return {
          kind: 'block',
          type: 'line',
          nodes: [{
            kind: 'text',
            ranges: [{
              text: line,
              marks: []
            }]
          }]
        };
      })
    }
  };

  return options.toRaw ? raw : _raw2.default.deserialize(raw);
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