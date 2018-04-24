'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _isEmpty = require('is-empty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _slateDevLogger = require('slate-dev-logger');

var _slateDevLogger2 = _interopRequireDefault(_slateDevLogger);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _selection = require('../models/selection');

var _selection2 = _interopRequireDefault(_selection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Set `properties` on the selection.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.select = function (change, properties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  properties = _selection2.default.createProperties(properties);

  var _options$snapshot = options.snapshot,
      snapshot = _options$snapshot === undefined ? false : _options$snapshot;
  var state = change.state;
  var document = state.document,
      selection = state.selection;

  var props = {};
  var sel = selection.toJSON();
  var next = selection.merge(properties).normalize(document);
  properties = (0, _pick2.default)(next, Object.keys(properties));

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (var k in properties) {
    if (snapshot == false && properties[k] == sel[k]) continue;
    props[k] = properties[k];
  }

  // Resolve the selection keys into paths.
  sel.anchorPath = sel.anchorKey == null ? null : document.getPath(sel.anchorKey);
  delete sel.anchorKey;

  if (props.anchorKey) {
    props.anchorPath = props.anchorKey == null ? null : document.getPath(props.anchorKey);
    delete props.anchorKey;
  }

  sel.focusPath = sel.focusKey == null ? null : document.getPath(sel.focusKey);
  delete sel.focusKey;

  if (props.focusKey) {
    props.focusPath = props.focusKey == null ? null : document.getPath(props.focusKey);
    delete props.focusKey;
  }

  // If the selection moves, clear any marks, unless the new selection
  // properties change the marks in some way.
  var moved = ['anchorPath', 'anchorOffset', 'focusPath', 'focusOffset'].some(function (p) {
    return props.hasOwnProperty(p);
  });

  if (sel.marks && properties.marks == sel.marks && moved) {
    props.marks = null;
  }

  // If there are no new properties to set, abort.
  if ((0, _isEmpty2.default)(props)) {
    return;
  }

  // Apply the operation.
  change.applyOperation({
    type: 'set_selection',
    properties: props,
    selection: sel
  }, snapshot ? { skip: false, merge: false } : {});
};

/**
 * Select the whole document.
 *
 * @param {Change} change
 */

Changes.selectAll = function (change) {
  var state = change.state;
  var document = state.document,
      selection = state.selection;

  var next = selection.moveToRangeOf(document);
  change.select(next);
};

/**
 * Snapshot the current selection.
 *
 * @param {Change} change
 */

Changes.snapshotSelection = function (change) {
  var state = change.state;
  var selection = state.selection;

  change.select(selection, { snapshot: true });
};

/**
 * Set `properties` on the selection.
 *
 * @param {Mixed} ...args
 * @param {Change} change
 */

Changes.moveTo = function (change, properties) {
  _slateDevLogger2.default.deprecate('0.17.0', 'The `moveTo()` change is deprecated, please use `select()` instead.');
  change.select(properties);
};

/**
 * Unset the selection's marks.
 *
 * @param {Change} change
 */

Changes.unsetMarks = function (change) {
  _slateDevLogger2.default.deprecate('0.17.0', 'The `unsetMarks()` change is deprecated.');
  change.select({ marks: null });
};

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Change} change
 */

Changes.unsetSelection = function (change) {
  _slateDevLogger2.default.deprecate('0.17.0', 'The `unsetSelection()` change is deprecated, please use `deselect()` instead.');
  change.select({
    anchorKey: null,
    anchorOffset: 0,
    focusKey: null,
    focusOffset: 0,
    isFocused: false,
    isBackward: false
  });
};

/**
 * Mix in selection changes that are just a proxy for the selection method.
 */

var PROXY_TRANSFORMS = ['blur', 'collapseTo', 'collapseToAnchor', 'collapseToEnd', 'collapseToEndOf', 'collapseToFocus', 'collapseToStart', 'collapseToStartOf', 'extend', 'extendTo', 'extendToEndOf', 'extendToStartOf', 'flip', 'focus', 'move', 'moveAnchor', 'moveAnchorOffsetTo', 'moveAnchorTo', 'moveAnchorToEndOf', 'moveAnchorToStartOf', 'moveEnd', 'moveEndOffsetTo', 'moveEndTo', 'moveFocus', 'moveFocusOffsetTo', 'moveFocusTo', 'moveFocusToEndOf', 'moveFocusToStartOf', 'moveOffsetsTo', 'moveStart', 'moveStartOffsetTo', 'moveStartTo',
// 'moveTo', Commented out for now, since it conflicts with a deprecated one.
'moveToEnd', 'moveToEndOf', 'moveToRangeOf', 'moveToStart', 'moveToStartOf', 'deselect'];

PROXY_TRANSFORMS.forEach(function (method) {
  Changes[method] = function (change) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var normalize = method != 'deselect';
    var state = change.state;
    var document = state.document,
        selection = state.selection;

    var next = selection[method].apply(selection, args);
    if (normalize) next = next.normalize(document);
    change.select(next);
  };
});

/**
 * Mix in node-related changes.
 */

var PREFIXES = ['moveTo', 'collapseTo', 'extendTo'];

var DIRECTIONS = ['Next', 'Previous'];

var KINDS = ['Block', 'Inline', 'Text'];

PREFIXES.forEach(function (prefix) {
  var edges = ['Start', 'End'];

  if (prefix == 'moveTo') {
    edges.push('Range');
  }

  edges.forEach(function (edge) {
    DIRECTIONS.forEach(function (direction) {
      KINDS.forEach(function (kind) {
        var get = 'get' + direction + kind;
        var getAtRange = 'get' + kind + 'sAtRange';
        var index = direction == 'Next' ? 'last' : 'first';
        var method = '' + prefix + edge + 'Of';
        var name = '' + method + direction + kind;

        Changes[name] = function (change) {
          var state = change.state;
          var document = state.document,
              selection = state.selection;

          var nodes = document[getAtRange](selection);
          var node = nodes[index]();
          var target = document[get](node.key);
          if (!target) return;
          var next = selection[method](target);
          change.select(next);
        };
      });
    });
  });
});

/**
 * Mix in deprecated changes with a warning.
 */

var DEPRECATED_TRANSFORMS = [['extendBackward', 'extend', 'The `extendBackward(n)` change is deprecated, please use `extend(n)` instead with a negative offset.'], ['extendForward', 'extend', 'The `extendForward(n)` change is deprecated, please use `extend(n)` instead.'], ['moveBackward', 'move', 'The `moveBackward(n)` change is deprecated, please use `move(n)` instead with a negative offset.'], ['moveForward', 'move', 'The `moveForward(n)` change is deprecated, please use `move(n)` instead.'], ['moveStartOffset', 'moveStart', 'The `moveStartOffset(n)` change is deprecated, please use `moveStart(n)` instead.'], ['moveEndOffset', 'moveEnd', 'The `moveEndOffset(n)` change is deprecated, please use `moveEnd()` instead.'], ['moveToOffsets', 'moveOffsetsTo', 'The `moveToOffsets()` change is deprecated, please use `moveOffsetsTo()` instead.'], ['flipSelection', 'flip', 'The `flipSelection()` change is deprecated, please use `flip()` instead.']];

DEPRECATED_TRANSFORMS.forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      old = _ref2[0],
      current = _ref2[1],
      warning = _ref2[2];

  Changes[old] = function (change) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    _slateDevLogger2.default.deprecate('0.17.0', warning);
    var state = change.state;
    var document = state.document,
        selection = state.selection;

    var sel = selection[current].apply(selection, args).normalize(document);
    change.select(sel);
  };
});

/**
 * Export.
 *
 * @type {Object}
 */

exports.default = Changes;