'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invert = require('../operations/invert');

var _invert2 = _interopRequireDefault(_invert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Redo to the next state in the history.
 *
 * @param {Change} change
 */

Changes.redo = function (change) {
  var state = change.state;
  var _state = state,
      history = _state.history;

  if (!history) return;

  var _history = history,
      undos = _history.undos,
      redos = _history.redos;

  var next = redos.peek();
  if (!next) return;

  // Shift the next state into the undo stack.
  redos = redos.pop();
  undos = undos.push(next);

  // Replay the next operations.
  next.forEach(function (op) {
    change.applyOperation(op, { save: false });
  });

  // Update the history.
  state = change.state;
  history = history.set('undos', undos).set('redos', redos);
  state = state.set('history', history);
  change.state = state;
};

/**
 * Undo the previous operations in the history.
 *
 * @param {Change} change
 */

Changes.undo = function (change) {
  var state = change.state;
  var _state2 = state,
      history = _state2.history;

  if (!history) return;

  var _history2 = history,
      undos = _history2.undos,
      redos = _history2.redos;

  var previous = undos.peek();
  if (!previous) return;

  // Shift the previous operations into the redo stack.
  undos = undos.pop();
  redos = redos.push(previous);

  // Replay the inverse of the previous operations.
  previous.slice().reverse().map(_invert2.default).forEach(function (inverse) {
    change.applyOperation(inverse, { save: false });
  });

  // Update the history.
  state = change.state;
  history = history.set('undos', undos).set('redos', redos);
  state = state.set('history', history);
  change.state = state;
};

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Changes;