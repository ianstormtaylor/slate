'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _slateDevLogger = require('slate-dev-logger');

var _slateDevLogger2 = _interopRequireDefault(_slateDevLogger);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _changes = require('../changes');

var _changes2 = _interopRequireDefault(_changes);

var _apply = require('../operations/apply');

var _apply2 = _interopRequireDefault(_apply);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:change');

/**
 * Change.
 *
 * @type {Change}
 */

var Change = function () {
  _createClass(Change, null, [{
    key: 'isChange',


    /**
     * Check if a `value` is a `Change`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

    value: function isChange(value) {
      return !!(value && value[_modelTypes2.default.CHANGE]);
    }

    /**
     * Create a new `Change` with `attrs`.
     *
     * @param {Object} attrs
     *   @property {State} state
     */

  }]);

  function Change(attrs) {
    _classCallCheck(this, Change);

    var state = attrs.state;

    this.state = state;
    this.operations = [];
    this.flags = (0, _pick2.default)(attrs, ['merge', 'save']);
  }

  /**
   * Get the kind.
   *
   * @return {String}
   */

  _createClass(Change, [{
    key: 'applyOperation',


    /**
     * Apply an `operation` to the current state, saving the operation to the
     * history if needed.
     *
     * @param {Object} operation
     * @param {Object} options
     * @return {Change}
     */

    value: function applyOperation(operation) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var operations = this.operations,
          flags = this.flags;
      var state = this.state;
      var _state = state,
          history = _state.history;

      // Default options to the change-level flags, this allows for setting
      // specific options for all of the operations of a given change.

      options = _extends({}, flags, options);

      // Derive the default option values.
      var _options = options,
          _options$merge = _options.merge,
          merge = _options$merge === undefined ? operations.length == 0 ? null : true : _options$merge,
          _options$save = _options.save,
          save = _options$save === undefined ? true : _options$save,
          _options$skip = _options.skip,
          skip = _options$skip === undefined ? null : _options$skip;

      // Apply the operation to the state.

      debug('apply', { operation: operation, save: save, merge: merge });
      state = (0, _apply2.default)(state, operation);

      // If needed, save the operation to the history.
      if (history && save) {
        history = history.save(operation, { merge: merge, skip: skip });
        state = state.set('history', history);
      }

      // Update the mutable change object.
      this.state = state;
      this.operations.push(operation);
      return this;
    }

    /**
     * Apply a series of `operations` to the current state.
     *
     * @param {Array} operations
     * @param {Object} options
     * @return {Change}
     */

  }, {
    key: 'applyOperations',
    value: function applyOperations(operations, options) {
      var _this = this;

      operations.forEach(function (op) {
        return _this.applyOperation(op, options);
      });
      return this;
    }

    /**
     * Call a change `fn` with arguments.
     *
     * @param {Function} fn
     * @param {Mixed} ...args
     * @return {Change}
     */

  }, {
    key: 'call',
    value: function call(fn) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      fn.apply(undefined, [this].concat(args));
      return this;
    }

    /**
     * Set an operation flag by `key` to `value`.
     *
     * @param {String} key
     * @param {Any} value
     * @return {Change}
     */

  }, {
    key: 'setOperationFlag',
    value: function setOperationFlag(key, value) {
      this.flags[key] = value;
      return this;
    }

    /**
     * Unset an operation flag by `key`.
     *
     * @param {String} key
     * @return {Change}
     */

  }, {
    key: 'unsetOperationFlag',
    value: function unsetOperationFlag(key) {
      delete this.flags[key];
      return this;
    }

    /**
     * Deprecated.
     *
     * @return {State}
     */

  }, {
    key: 'apply',
    value: function apply() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _slateDevLogger2.default.deprecate('0.22.0', 'The `change.apply()` method is deprecrated and no longer necessary, as all operations are applied immediately when invoked. You can access the change\'s state, which is already pre-computed, directly via `change.state` instead.');
      return this.state;
    }
  }, {
    key: 'kind',
    get: function get() {
      return 'change';
    }
  }]);

  return Change;
}();

/**
 * Attach a pseudo-symbol for type checking.
 */

Change.prototype[_modelTypes2.default.CHANGE] = true;

/**
 * Add a change method for each of the changes.
 */

Object.keys(_changes2.default).forEach(function (type) {
  Change.prototype[type] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    debug(type, { args: args });
    this.call.apply(this, [_changes2.default[type]].concat(args));
    return this;
  };
})

/**
 * Add deprecation warnings in case people try to access a change as a state.
 */

;['hasUndos', 'hasRedos', 'isBlurred', 'isFocused', 'isCollapsed', 'isExpanded', 'isBackward', 'isForward', 'startKey', 'endKey', 'startOffset', 'endOffset', 'anchorKey', 'focusKey', 'anchorOffset', 'focusOffset', 'startBlock', 'endBlock', 'anchorBlock', 'focusBlock', 'startInline', 'endInline', 'anchorInline', 'focusInline', 'startText', 'endText', 'anchorText', 'focusText', 'characters', 'marks', 'blocks', 'fragment', 'inlines', 'texts', 'isEmpty'].forEach(function (getter) {
  Object.defineProperty(Change.prototype, getter, {
    get: function get() {
      _slateDevLogger2.default.deprecate('0.22.0', 'You attempted to access the `' + getter + '` property of what was previously a `state` object but is now a `change` object. This syntax has been deprecated as plugins are now passed `change` objects instead of `state` objects.');
      return this.state[getter];
    }
  });
});

Change.prototype.transform = function () {
  _slateDevLogger2.default.deprecate('0.22.0', 'You attempted to call `.transform()` on what was previously a `state` object but is now already a `change` object. This syntax has been deprecated as plugins are now passed `change` objects instead of `state` objects.');
  return this;
};

/**
 * Export.
 *
 * @type {Change}
 */

exports.default = Change;