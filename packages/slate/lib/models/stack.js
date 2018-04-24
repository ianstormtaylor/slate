'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _immutable = require('immutable');

var _modelTypes = require('../constants/model-types');

var _modelTypes2 = _interopRequireDefault(_modelTypes);

var _schema2 = require('./schema');

var _schema3 = _interopRequireDefault(_schema2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:stack');

/**
 * Methods that are triggered on events and can change the state.
 *
 * @type {Array}
 */

var METHODS = ['onBeforeInput', 'onBeforeChange', 'onBlur', 'onCopy', 'onCut', 'onDrop', 'onFocus', 'onKeyDown', 'onKeyUp', 'onPaste', 'onSelect', 'onChange'];

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  plugins: [],
  schema: new _schema3.default()
};

/**
 * Stack.
 *
 * @type {Stack}
 */

var Stack = function (_Record) {
  _inherits(Stack, _Record);

  function Stack() {
    _classCallCheck(this, Stack);

    return _possibleConstructorReturn(this, (Stack.__proto__ || Object.getPrototypeOf(Stack)).apply(this, arguments));
  }

  _createClass(Stack, [{
    key: 'render',


    /**
     * Invoke `render` on all of the plugins in reverse, building up a tree of
     * higher-order components.
     *
     * @param {State} state
     * @param {Editor} editor
     * @param {Object} children
     * @param {Object} props
     * @return {Component}
     */

    value: function render(state, editor, props) {
      debug('render');
      var plugins = this.plugins.slice().reverse();
      var children = void 0;

      for (var i = 0; i < plugins.length; i++) {
        var plugin = plugins[i];
        if (!plugin.render) continue;
        children = plugin.render(props, state, editor);
        props.children = children;
      }

      return children;
    }

    /**
     * Invoke `renderPortal` on all of the plugins, building a list of portals.
     *
     * @param {State} state
     * @param {Editor} editor
     * @return {Array}
     */

  }, {
    key: 'renderPortal',
    value: function renderPortal(state, editor) {
      debug('renderPortal');
      var portals = [];

      for (var i = 0; i < this.plugins.length; i++) {
        var plugin = this.plugins[i];
        if (!plugin.renderPortal) continue;
        var portal = plugin.renderPortal(state, editor);
        if (portal) portals.push(portal);
      }

      return portals;
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'stack';
    }
  }], [{
    key: 'create',


    /**
     * Constructor.
     *
     * @param {Object} attrs
     *   @property {Array} plugins
     *   @property {Schema|Object} schema
     *   @property {Function} ...handlers
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var plugins = attrs.plugins;

      var schema = resolveSchema(plugins);
      var stack = new Stack({ plugins: plugins, schema: schema });
      return stack;
    }

    /**
     * Check if a `value` is a `Stack`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

  }, {
    key: 'isStack',
    value: function isStack(value) {
      return !!(value && value[_modelTypes2.default.STACK]);
    }
  }]);

  return Stack;
}((0, _immutable.Record)(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Stack.prototype[_modelTypes2.default.STACK] = true;

/**
 * Mix in the stack methods.
 *
 * @param {Change} change
 * @param {Editor} editor
 * @param {Mixed} ...args
 */

var _loop = function _loop(i) {
  var method = METHODS[i];
  Stack.prototype[method] = function (change, editor) {
    debug(method);

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    for (var k = 0; k < this.plugins.length; k++) {
      var plugin = this.plugins[k];
      if (!plugin[method]) continue;
      var next = plugin[method].apply(plugin, args.concat([change, editor]));
      if (next != null) break;
    }
  };
};

for (var i = 0; i < METHODS.length; i++) {
  _loop(i);
}

/**
 * Resolve a schema from a set of `plugins`.
 *
 * @param {Array} plugins
 * @return {Schema}
 */

function resolveSchema(plugins) {
  var rules = [];

  for (var i = 0; i < plugins.length; i++) {
    var plugin = plugins[i];
    if (plugin.schema == null) continue;
    var _schema = _schema3.default.create(plugin.schema);
    rules = rules.concat(_schema.rules);
  }

  var schema = _schema3.default.create({ rules: rules });
  return schema;
}

/**
 * Export.
 *
 * @type {Stack}
 */

exports.default = Stack;