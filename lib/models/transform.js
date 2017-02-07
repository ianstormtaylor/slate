'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _transforms = require('../transforms');

var _transforms2 = _interopRequireDefault(_transforms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:transform');

/**
 * Transform.
 *
 * @type {Transform}
 */

var Transform = function () {

  /**
   * Constructor.
   *
   * @param {Object} properties
   *   @property {State} state
   */

  function Transform(properties) {
    _classCallCheck(this, Transform);

    var state = properties.state;

    this.state = state;
    this.operations = [];
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  _createClass(Transform, [{
    key: 'apply',


    /**
     * Apply the transform and return the new state.
     *
     * @param {Object} options
     *   @property {Boolean} isNative
     *   @property {Boolean} merge
     *   @property {Boolean} save
     * @return {State}
     */

    value: function apply() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var transform = this;
      var merge = options.merge,
          save = options.save,
          _options$isNative = options.isNative,
          isNative = _options$isNative === undefined ? false : _options$isNative;

      // Ensure that the selection is normalized.

      transform.normalizeSelection();

      var state = transform.state,
          operations = transform.operations;
      var history = state.history;
      var undos = history.undos;

      var previous = undos.peek();

      // If there are no operations, abort early.
      if (!operations.length) return state;

      // If there's a previous save point, determine if the new operations should
      // be merged into the previous ones.
      if (previous && merge == null) {
        merge = isOnlySelections(operations) || isContiguousInserts(operations, previous) || isContiguousRemoves(operations, previous);
      }

      // If the save flag isn't set, determine whether we should save.
      if (save == null) {
        save = !isOnlySelections(operations);
      }

      // Save the new operations.
      if (save) this.save({ merge: merge });

      // Return the new state with the `isNative` flag set.
      return this.state.merge({ isNative: !!isNative });
    }
  }, {
    key: 'kind',
    get: function get() {
      return 'transform';
    }
  }]);

  return Transform;
}();

/**
 * Add a transform method for each of the transforms.
 */

Object.keys(_transforms2.default).forEach(function (type) {
  Transform.prototype[type] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    debug(type, { args: args });
    _transforms2.default[type].apply(_transforms2.default, [this].concat(args));
    return this;
  };
});

/**
 * Check whether a list of `operations` only contains selection operations.
 *
 * @param {Array} operations
 * @return {Boolean}
 */

function isOnlySelections(operations) {
  return operations.every(function (op) {
    return op.type == 'set_selection';
  });
}

/**
 * Check whether a list of `operations` and a list of `previous` operations are
 * contiguous text insertions.
 *
 * @param {Array} operations
 * @param {Array} previous
 */

function isContiguousInserts(operations, previous) {
  var edits = operations.filter(function (op) {
    return op.type != 'set_selection';
  });
  var prevEdits = previous.filter(function (op) {
    return op.type != 'set_selection';
  });
  if (!edits.length || !prevEdits.length) return false;

  var onlyInserts = edits.every(function (op) {
    return op.type == 'insert_text';
  });
  var prevOnlyInserts = prevEdits.every(function (op) {
    return op.type == 'insert_text';
  });
  if (!onlyInserts || !prevOnlyInserts) return false;

  var first = edits[0];
  var last = prevEdits[prevEdits.length - 1];
  if (first.key != last.key) return false;
  if (first.offset != last.offset + last.text.length) return false;

  return true;
}

/**
 * Check whether a list of `operations` and a list of `previous` operations are
 * contiguous text removals.
 *
 * @param {Array} operations
 * @param {Array} previous
 */

function isContiguousRemoves(operations, previous) {
  var edits = operations.filter(function (op) {
    return op.type != 'set_selection';
  });
  var prevEdits = previous.filter(function (op) {
    return op.type != 'set_selection';
  });
  if (!edits.length || !prevEdits.length) return false;

  var onlyRemoves = edits.every(function (op) {
    return op.type == 'remove_text';
  });
  var prevOnlyRemoves = prevEdits.every(function (op) {
    return op.type == 'remove_text';
  });
  if (!onlyRemoves || !prevOnlyRemoves) return false;

  var first = edits[0];
  var last = prevEdits[prevEdits.length - 1];
  if (first.key != last.key) return false;
  if (first.offset + first.length != last.offset) return false;

  return true;
}

/**
 * Export.
 *
 * @type {Transform}
 */

exports.default = Transform;