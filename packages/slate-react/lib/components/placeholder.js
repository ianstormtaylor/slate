'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _slatePropTypes = require('slate-prop-types');

var _slatePropTypes2 = _interopRequireDefault(_slatePropTypes);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Placeholder.
 *
 * @type {Component}
 */

var Placeholder = function (_React$Component) {
  _inherits(Placeholder, _React$Component);

  function Placeholder() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Placeholder);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Placeholder.__proto__ || Object.getPrototypeOf(Placeholder)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = function (props, state) {
      return props.children != _this.props.children || props.className != _this.props.className || props.firstOnly != _this.props.firstOnly || props.parent != _this.props.parent || props.node != _this.props.node || props.style != _this.props.style;
    }, _this.isVisible = function () {
      var _this$props = _this.props,
          firstOnly = _this$props.firstOnly,
          node = _this$props.node,
          parent = _this$props.parent;

      if (node.text) return false;

      if (firstOnly) {
        if (parent.nodes.size > 1) return false;
        if (parent.nodes.first() === node) return true;
        return false;
      } else {
        return true;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Property types.
   *
   * @type {Object}
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  /**
   * Should the placeholder update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  /**
   * Is the placeholder visible?
   *
   * @return {Boolean}
   */

  _createClass(Placeholder, [{
    key: 'render',


    /**
     * Render.
     *
     * If the placeholder is a string, and no `className` or `style` has been
     * passed, give it a default style of lowered opacity.
     *
     * @return {Element}
     */

    value: function render() {
      var isVisible = this.isVisible();
      if (!isVisible) return null;

      var _props = this.props,
          children = _props.children,
          className = _props.className;
      var style = this.props.style;


      if (typeof children === 'string' && style == null && className == null) {
        style = { opacity: '0.333' };
      } else if (style == null) {
        style = {};
      }

      var styles = _extends({
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        pointerEvents: 'none'
      }, style);

      return _react2.default.createElement(
        'span',
        { contentEditable: false, className: className, style: styles },
        children
      );
    }
  }]);

  return Placeholder;
}(_react2.default.Component);

/**
 * Export.
 *
 * @type {Component}
 */

Placeholder.propTypes = {
  children: _propTypes2.default.any.isRequired,
  className: _propTypes2.default.string,
  firstOnly: _propTypes2.default.bool,
  node: _slatePropTypes2.default.node.isRequired,
  parent: _slatePropTypes2.default.node,
  state: _slatePropTypes2.default.state.isRequired,
  style: _propTypes2.default.object
};
Placeholder.defaultProps = {
  firstOnly: true
};
exports.default = Placeholder;