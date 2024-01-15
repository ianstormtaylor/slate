'use strict';

var isPlainObject = require('is-plain-object');
var immer = require('immer');

// eslint-disable-next-line no-redeclare
var PathRef = {
  transform: function transform(ref, op) {
    var current = ref.current,
      affinity = ref.affinity;
    if (current == null) {
      return;
    }
    var path = Path.transform(current, op, {
      affinity: affinity
    });
    ref.current = path;
    if (path == null) {
      ref.unref();
    }
  }
};

// eslint-disable-next-line no-redeclare
var PointRef = {
  transform: function transform(ref, op) {
    var current = ref.current,
      affinity = ref.affinity;
    if (current == null) {
      return;
    }
    var point = Point.transform(current, op, {
      affinity: affinity
    });
    ref.current = point;
    if (point == null) {
      ref.unref();
    }
  }
};

// eslint-disable-next-line no-redeclare
var RangeRef = {
  transform: function transform(ref, op) {
    var current = ref.current,
      affinity = ref.affinity;
    if (current == null) {
      return;
    }
    var path = Range.transform(current, op, {
      affinity: affinity
    });
    ref.current = path;
    if (path == null) {
      ref.unref();
    }
  }
};

var DIRTY_PATHS = new WeakMap();
var DIRTY_PATH_KEYS = new WeakMap();
var FLUSHING = new WeakMap();
var NORMALIZING = new WeakMap();
var PATH_REFS = new WeakMap();
var POINT_REFS = new WeakMap();
var RANGE_REFS = new WeakMap();

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayLikeToArray);

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayWithoutHoles);

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(iterableToArray);

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(unsupportedIterableToArray);

var nonIterableSpread = createCommonjsModule(function (module) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(nonIterableSpread);

var toConsumableArray = createCommonjsModule(function (module) {
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _toConsumableArray = unwrapExports(toConsumableArray);

// eslint-disable-next-line no-redeclare
var Path = {
  ancestors: function ancestors(path) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$reverse = options.reverse,
      reverse = _options$reverse === void 0 ? false : _options$reverse;
    var paths = Path.levels(path, options);
    if (reverse) {
      paths = paths.slice(1);
    } else {
      paths = paths.slice(0, -1);
    }
    return paths;
  },
  common: function common(path, another) {
    var common = [];
    for (var i = 0; i < path.length && i < another.length; i++) {
      var av = path[i];
      var bv = another[i];
      if (av !== bv) {
        break;
      }
      common.push(av);
    }
    return common;
  },
  compare: function compare(path, another) {
    var min = Math.min(path.length, another.length);
    for (var i = 0; i < min; i++) {
      if (path[i] < another[i]) return -1;
      if (path[i] > another[i]) return 1;
    }
    return 0;
  },
  endsAfter: function endsAfter(path, another) {
    var i = path.length - 1;
    var as = path.slice(0, i);
    var bs = another.slice(0, i);
    var av = path[i];
    var bv = another[i];
    return Path.equals(as, bs) && av > bv;
  },
  endsAt: function endsAt(path, another) {
    var i = path.length;
    var as = path.slice(0, i);
    var bs = another.slice(0, i);
    return Path.equals(as, bs);
  },
  endsBefore: function endsBefore(path, another) {
    var i = path.length - 1;
    var as = path.slice(0, i);
    var bs = another.slice(0, i);
    var av = path[i];
    var bv = another[i];
    return Path.equals(as, bs) && av < bv;
  },
  equals: function equals(path, another) {
    return path.length === another.length && path.every(function (n, i) {
      return n === another[i];
    });
  },
  hasPrevious: function hasPrevious(path) {
    return path[path.length - 1] > 0;
  },
  isAfter: function isAfter(path, another) {
    return Path.compare(path, another) === 1;
  },
  isAncestor: function isAncestor(path, another) {
    return path.length < another.length && Path.compare(path, another) === 0;
  },
  isBefore: function isBefore(path, another) {
    return Path.compare(path, another) === -1;
  },
  isChild: function isChild(path, another) {
    return path.length === another.length + 1 && Path.compare(path, another) === 0;
  },
  isCommon: function isCommon(path, another) {
    return path.length <= another.length && Path.compare(path, another) === 0;
  },
  isDescendant: function isDescendant(path, another) {
    return path.length > another.length && Path.compare(path, another) === 0;
  },
  isParent: function isParent(path, another) {
    return path.length + 1 === another.length && Path.compare(path, another) === 0;
  },
  isPath: function isPath(value) {
    return Array.isArray(value) && (value.length === 0 || typeof value[0] === 'number');
  },
  isSibling: function isSibling(path, another) {
    if (path.length !== another.length) {
      return false;
    }
    var as = path.slice(0, -1);
    var bs = another.slice(0, -1);
    var al = path[path.length - 1];
    var bl = another[another.length - 1];
    return al !== bl && Path.equals(as, bs);
  },
  levels: function levels(path) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$reverse2 = options.reverse,
      reverse = _options$reverse2 === void 0 ? false : _options$reverse2;
    var list = [];
    for (var i = 0; i <= path.length; i++) {
      list.push(path.slice(0, i));
    }
    if (reverse) {
      list.reverse();
    }
    return list;
  },
  next: function next(path) {
    if (path.length === 0) {
      throw new Error("Cannot get the next path of a root path [".concat(path, "], because it has no next index."));
    }
    var last = path[path.length - 1];
    return path.slice(0, -1).concat(last + 1);
  },
  operationCanTransformPath: function operationCanTransformPath(operation) {
    switch (operation.type) {
      case 'insert_node':
      case 'remove_node':
      case 'merge_node':
      case 'split_node':
      case 'move_node':
        return true;
      default:
        return false;
    }
  },
  parent: function parent(path) {
    if (path.length === 0) {
      throw new Error("Cannot get the parent path of the root path [".concat(path, "]."));
    }
    return path.slice(0, -1);
  },
  previous: function previous(path) {
    if (path.length === 0) {
      throw new Error("Cannot get the previous path of a root path [".concat(path, "], because it has no previous index."));
    }
    var last = path[path.length - 1];
    if (last <= 0) {
      throw new Error("Cannot get the previous path of a first child path [".concat(path, "] because it would result in a negative index."));
    }
    return path.slice(0, -1).concat(last - 1);
  },
  relative: function relative(path, ancestor) {
    if (!Path.isAncestor(ancestor, path) && !Path.equals(path, ancestor)) {
      throw new Error("Cannot get the relative path of [".concat(path, "] inside ancestor [").concat(ancestor, "], because it is not above or equal to the path."));
    }
    return path.slice(ancestor.length);
  },
  transform: function transform(path, operation) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!path) return null;
    // PERF: use destructing instead of immer
    var p = _toConsumableArray(path);
    var _options$affinity = options.affinity,
      affinity = _options$affinity === void 0 ? 'forward' : _options$affinity;
    // PERF: Exit early if the operation is guaranteed not to have an effect.
    if (path.length === 0) {
      return p;
    }
    switch (operation.type) {
      case 'insert_node':
        {
          var op = operation.path;
          if (Path.equals(op, p) || Path.endsBefore(op, p) || Path.isAncestor(op, p)) {
            p[op.length - 1] += 1;
          }
          break;
        }
      case 'remove_node':
        {
          var _op = operation.path;
          if (Path.equals(_op, p) || Path.isAncestor(_op, p)) {
            return null;
          } else if (Path.endsBefore(_op, p)) {
            p[_op.length - 1] -= 1;
          }
          break;
        }
      case 'merge_node':
        {
          var _op2 = operation.path,
            position = operation.position;
          if (Path.equals(_op2, p) || Path.endsBefore(_op2, p)) {
            p[_op2.length - 1] -= 1;
          } else if (Path.isAncestor(_op2, p)) {
            p[_op2.length - 1] -= 1;
            p[_op2.length] += position;
          }
          break;
        }
      case 'split_node':
        {
          var _op3 = operation.path,
            _position = operation.position;
          if (Path.equals(_op3, p)) {
            if (affinity === 'forward') {
              p[p.length - 1] += 1;
            } else if (affinity === 'backward') ; else {
              return null;
            }
          } else if (Path.endsBefore(_op3, p)) {
            p[_op3.length - 1] += 1;
          } else if (Path.isAncestor(_op3, p) && path[_op3.length] >= _position) {
            p[_op3.length - 1] += 1;
            p[_op3.length] -= _position;
          }
          break;
        }
      case 'move_node':
        {
          var _op4 = operation.path,
            onp = operation.newPath;
          // If the old and new path are the same, it's a no-op.
          if (Path.equals(_op4, onp)) {
            return p;
          }
          if (Path.isAncestor(_op4, p) || Path.equals(_op4, p)) {
            var copy = onp.slice();
            if (Path.endsBefore(_op4, onp) && _op4.length < onp.length) {
              copy[_op4.length - 1] -= 1;
            }
            return copy.concat(p.slice(_op4.length));
          } else if (Path.isSibling(_op4, onp) && (Path.isAncestor(onp, p) || Path.equals(onp, p))) {
            if (Path.endsBefore(_op4, p)) {
              p[_op4.length - 1] -= 1;
            } else {
              p[_op4.length - 1] += 1;
            }
          } else if (Path.endsBefore(onp, p) || Path.equals(onp, p) || Path.isAncestor(onp, p)) {
            if (Path.endsBefore(_op4, p)) {
              p[_op4.length - 1] -= 1;
            }
            p[onp.length - 1] += 1;
          } else if (Path.endsBefore(_op4, p)) {
            if (Path.equals(onp, p)) {
              p[onp.length - 1] += 1;
            }
            p[_op4.length - 1] -= 1;
          }
          break;
        }
    }
    return p;
  }
};

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(_typeof_1);

var toPrimitive = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(toPrimitive);

var toPropertyKey = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];

function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(toPropertyKey);

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _defineProperty = unwrapExports(defineProperty);

var arrayWithHoles = createCommonjsModule(function (module) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayWithHoles);

var iterableToArrayLimit = createCommonjsModule(function (module) {
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(iterableToArrayLimit);

var nonIterableRest = createCommonjsModule(function (module) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(nonIterableRest);

var slicedToArray = createCommonjsModule(function (module) {
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _slicedToArray = unwrapExports(slicedToArray);

function ownKeys$e(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$e(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$e(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$e(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper$l(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$l(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$l(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$l(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$l(o, minLen); }
function _arrayLikeToArray$l(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var applyToDraft = function applyToDraft(editor, selection, op) {
  switch (op.type) {
    case 'insert_node':
      {
        var path = op.path,
          node = op.node;
        var parent = Node.parent(editor, path);
        var index = path[path.length - 1];
        if (index > parent.children.length) {
          throw new Error("Cannot apply an \"insert_node\" operation at path [".concat(path, "] because the destination is past the end of the node."));
        }
        parent.children.splice(index, 0, node);
        if (selection) {
          var _iterator = _createForOfIteratorHelper$l(Range.points(selection)),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _step$value = _slicedToArray(_step.value, 2),
                point = _step$value[0],
                key = _step$value[1];
              selection[key] = Point.transform(point, op);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        break;
      }
    case 'insert_text':
      {
        var _path = op.path,
          offset = op.offset,
          text = op.text;
        if (text.length === 0) break;
        var _node = Node.leaf(editor, _path);
        var before = _node.text.slice(0, offset);
        var after = _node.text.slice(offset);
        _node.text = before + text + after;
        if (selection) {
          var _iterator2 = _createForOfIteratorHelper$l(Range.points(selection)),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _step2$value = _slicedToArray(_step2.value, 2),
                _point = _step2$value[0],
                _key = _step2$value[1];
              selection[_key] = Point.transform(_point, op);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
        break;
      }
    case 'merge_node':
      {
        var _path2 = op.path;
        var _node2 = Node.get(editor, _path2);
        var prevPath = Path.previous(_path2);
        var prev = Node.get(editor, prevPath);
        var _parent = Node.parent(editor, _path2);
        var _index = _path2[_path2.length - 1];
        if (Text.isText(_node2) && Text.isText(prev)) {
          prev.text += _node2.text;
        } else if (!Text.isText(_node2) && !Text.isText(prev)) {
          var _prev$children;
          (_prev$children = prev.children).push.apply(_prev$children, _toConsumableArray(_node2.children));
        } else {
          throw new Error("Cannot apply a \"merge_node\" operation at path [".concat(_path2, "] to nodes of different interfaces: ").concat(Scrubber.stringify(_node2), " ").concat(Scrubber.stringify(prev)));
        }
        _parent.children.splice(_index, 1);
        if (selection) {
          var _iterator3 = _createForOfIteratorHelper$l(Range.points(selection)),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _step3$value = _slicedToArray(_step3.value, 2),
                _point2 = _step3$value[0],
                _key2 = _step3$value[1];
              selection[_key2] = Point.transform(_point2, op);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
        break;
      }
    case 'move_node':
      {
        var _path3 = op.path,
          newPath = op.newPath;
        if (Path.isAncestor(_path3, newPath)) {
          throw new Error("Cannot move a path [".concat(_path3, "] to new path [").concat(newPath, "] because the destination is inside itself."));
        }
        var _node3 = Node.get(editor, _path3);
        var _parent2 = Node.parent(editor, _path3);
        var _index2 = _path3[_path3.length - 1];
        // This is tricky, but since the `path` and `newPath` both refer to
        // the same snapshot in time, there's a mismatch. After either
        // removing the original position, the second step's path can be out
        // of date. So instead of using the `op.newPath` directly, we
        // transform `op.path` to ascertain what the `newPath` would be after
        // the operation was applied.
        _parent2.children.splice(_index2, 1);
        var truePath = Path.transform(_path3, op);
        var newParent = Node.get(editor, Path.parent(truePath));
        var newIndex = truePath[truePath.length - 1];
        newParent.children.splice(newIndex, 0, _node3);
        if (selection) {
          var _iterator4 = _createForOfIteratorHelper$l(Range.points(selection)),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _step4$value = _slicedToArray(_step4.value, 2),
                _point3 = _step4$value[0],
                _key3 = _step4$value[1];
              selection[_key3] = Point.transform(_point3, op);
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }
        break;
      }
    case 'remove_node':
      {
        var _path4 = op.path;
        var _index3 = _path4[_path4.length - 1];
        var _parent3 = Node.parent(editor, _path4);
        _parent3.children.splice(_index3, 1);
        // Transform all the points in the value, but if the point was in the
        // node that was removed we need to update the range or remove it.
        if (selection) {
          var _iterator5 = _createForOfIteratorHelper$l(Range.points(selection)),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _step5$value = _slicedToArray(_step5.value, 2),
                _point4 = _step5$value[0],
                _key4 = _step5$value[1];
              var result = Point.transform(_point4, op);
              if (selection != null && result != null) {
                selection[_key4] = result;
              } else {
                var _prev = void 0;
                var next = void 0;
                var _iterator6 = _createForOfIteratorHelper$l(Node.texts(editor)),
                  _step6;
                try {
                  for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                    var _step6$value = _slicedToArray(_step6.value, 2),
                      n = _step6$value[0],
                      p = _step6$value[1];
                    if (Path.compare(p, _path4) === -1) {
                      _prev = [n, p];
                    } else {
                      next = [n, p];
                      break;
                    }
                  }
                } catch (err) {
                  _iterator6.e(err);
                } finally {
                  _iterator6.f();
                }
                var preferNext = false;
                if (_prev && next) {
                  if (Path.equals(next[1], _path4)) {
                    preferNext = !Path.hasPrevious(next[1]);
                  } else {
                    preferNext = Path.common(_prev[1], _path4).length < Path.common(next[1], _path4).length;
                  }
                }
                if (_prev && !preferNext) {
                  _point4.path = _prev[1];
                  _point4.offset = _prev[0].text.length;
                } else if (next) {
                  _point4.path = next[1];
                  _point4.offset = 0;
                } else {
                  selection = null;
                }
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
        break;
      }
    case 'remove_text':
      {
        var _path5 = op.path,
          _offset = op.offset,
          _text = op.text;
        if (_text.length === 0) break;
        var _node4 = Node.leaf(editor, _path5);
        var _before = _node4.text.slice(0, _offset);
        var _after = _node4.text.slice(_offset + _text.length);
        _node4.text = _before + _after;
        if (selection) {
          var _iterator7 = _createForOfIteratorHelper$l(Range.points(selection)),
            _step7;
          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var _step7$value = _slicedToArray(_step7.value, 2),
                _point5 = _step7$value[0],
                _key5 = _step7$value[1];
              selection[_key5] = Point.transform(_point5, op);
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        }
        break;
      }
    case 'set_node':
      {
        var _path6 = op.path,
          properties = op.properties,
          newProperties = op.newProperties;
        if (_path6.length === 0) {
          throw new Error("Cannot set properties on the root node!");
        }
        var _node5 = Node.get(editor, _path6);
        for (var _key6 in newProperties) {
          if (_key6 === 'children' || _key6 === 'text') {
            throw new Error("Cannot set the \"".concat(_key6, "\" property of nodes!"));
          }
          var value = newProperties[_key6];
          if (value == null) {
            delete _node5[_key6];
          } else {
            _node5[_key6] = value;
          }
        }
        // properties that were previously defined, but are now missing, must be deleted
        for (var _key7 in properties) {
          if (!newProperties.hasOwnProperty(_key7)) {
            delete _node5[_key7];
          }
        }
        break;
      }
    case 'set_selection':
      {
        var _newProperties = op.newProperties;
        if (_newProperties == null) {
          selection = _newProperties;
        } else {
          if (selection == null) {
            if (!Range.isRange(_newProperties)) {
              throw new Error("Cannot apply an incomplete \"set_selection\" operation properties ".concat(Scrubber.stringify(_newProperties), " when there is no current selection."));
            }
            selection = _objectSpread$e({}, _newProperties);
          }
          for (var _key8 in _newProperties) {
            var _value = _newProperties[_key8];
            if (_value == null) {
              if (_key8 === 'anchor' || _key8 === 'focus') {
                throw new Error("Cannot remove the \"".concat(_key8, "\" selection property"));
              }
              delete selection[_key8];
            } else {
              selection[_key8] = _value;
            }
          }
        }
        break;
      }
    case 'split_node':
      {
        var _path7 = op.path,
          position = op.position,
          _properties = op.properties;
        if (_path7.length === 0) {
          throw new Error("Cannot apply a \"split_node\" operation at path [".concat(_path7, "] because the root node cannot be split."));
        }
        var _node6 = Node.get(editor, _path7);
        var _parent4 = Node.parent(editor, _path7);
        var _index4 = _path7[_path7.length - 1];
        var newNode;
        if (Text.isText(_node6)) {
          var _before2 = _node6.text.slice(0, position);
          var _after2 = _node6.text.slice(position);
          _node6.text = _before2;
          newNode = _objectSpread$e(_objectSpread$e({}, _properties), {}, {
            text: _after2
          });
        } else {
          var _before3 = _node6.children.slice(0, position);
          var _after3 = _node6.children.slice(position);
          _node6.children = _before3;
          newNode = _objectSpread$e(_objectSpread$e({}, _properties), {}, {
            children: _after3
          });
        }
        _parent4.children.splice(_index4 + 1, 0, newNode);
        if (selection) {
          var _iterator8 = _createForOfIteratorHelper$l(Range.points(selection)),
            _step8;
          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var _step8$value = _slicedToArray(_step8.value, 2),
                _point6 = _step8$value[0],
                _key9 = _step8$value[1];
              selection[_key9] = Point.transform(_point6, op);
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
        }
        break;
      }
  }
  return selection;
};
// eslint-disable-next-line no-redeclare
var GeneralTransforms = {
  transform: function transform(editor, op) {
    editor.children = immer.createDraft(editor.children);
    var selection = editor.selection && immer.createDraft(editor.selection);
    try {
      selection = applyToDraft(editor, selection, op);
    } finally {
      editor.children = immer.finishDraft(editor.children);
      if (selection) {
        editor.selection = immer.isDraft(selection) ? immer.finishDraft(selection) : selection;
      } else {
        editor.selection = null;
      }
    }
  }
};

// eslint-disable-next-line no-redeclare
var NodeTransforms = {
  insertNodes: function insertNodes(editor, nodes, options) {
    editor.insertNodes(nodes, options);
  },
  liftNodes: function liftNodes(editor, options) {
    editor.liftNodes(options);
  },
  mergeNodes: function mergeNodes(editor, options) {
    editor.mergeNodes(options);
  },
  moveNodes: function moveNodes(editor, options) {
    editor.moveNodes(options);
  },
  removeNodes: function removeNodes(editor, options) {
    editor.removeNodes(options);
  },
  setNodes: function setNodes(editor, props, options) {
    editor.setNodes(props, options);
  },
  splitNodes: function splitNodes(editor, options) {
    editor.splitNodes(options);
  },
  unsetNodes: function unsetNodes(editor, props, options) {
    editor.unsetNodes(props, options);
  },
  unwrapNodes: function unwrapNodes(editor, options) {
    editor.unwrapNodes(options);
  },
  wrapNodes: function wrapNodes(editor, element, options) {
    editor.wrapNodes(element, options);
  }
};

// eslint-disable-next-line no-redeclare
var SelectionTransforms = {
  collapse: function collapse(editor, options) {
    editor.collapse(options);
  },
  deselect: function deselect(editor) {
    editor.deselect();
  },
  move: function move(editor, options) {
    editor.move(options);
  },
  select: function select(editor, target) {
    editor.select(target);
  },
  setPoint: function setPoint(editor, props, options) {
    editor.setPoint(props, options);
  },
  setSelection: function setSelection(editor, props) {
    editor.setSelection(props);
  }
};

/*
  Custom deep equal comparison for Slate nodes.

  We don't need general purpose deep equality;
  Slate only supports plain values, Arrays, and nested objects.
  Complex values nested inside Arrays are not supported.

  Slate objects are designed to be serialised, so
  missing keys are deliberately normalised to undefined.
 */
var isDeepEqual = function isDeepEqual(node, another) {
  for (var key in node) {
    var a = node[key];
    var b = another[key];
    if (isPlainObject.isPlainObject(a) && isPlainObject.isPlainObject(b)) {
      if (!isDeepEqual(a, b)) return false;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
    } else if (a !== b) {
      return false;
    }
  }
  /*
    Deep object equality is only necessary in one direction; in the reverse direction
    we are only looking for keys that are missing.
    As above, undefined keys are normalised to missing.
  */
  for (var _key in another) {
    if (node[_key] === undefined && another[_key] !== undefined) {
      return false;
    }
  }
  return true;
};

var objectWithoutPropertiesLoose = createCommonjsModule(function (module) {
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(objectWithoutPropertiesLoose);

var objectWithoutProperties = createCommonjsModule(function (module) {
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
module.exports = _objectWithoutProperties, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _objectWithoutProperties = unwrapExports(objectWithoutProperties);

var _excluded$4 = ["anchor", "focus"];
function ownKeys$d(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$d(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$d(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$d(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// eslint-disable-next-line no-redeclare
var Range = {
  edges: function edges(range) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$reverse = options.reverse,
      reverse = _options$reverse === void 0 ? false : _options$reverse;
    var anchor = range.anchor,
      focus = range.focus;
    return Range.isBackward(range) === reverse ? [anchor, focus] : [focus, anchor];
  },
  end: function end(range) {
    var _Range$edges = Range.edges(range),
      _Range$edges2 = _slicedToArray(_Range$edges, 2),
      end = _Range$edges2[1];
    return end;
  },
  equals: function equals(range, another) {
    return Point.equals(range.anchor, another.anchor) && Point.equals(range.focus, another.focus);
  },
  includes: function includes(range, target) {
    if (Range.isRange(target)) {
      if (Range.includes(range, target.anchor) || Range.includes(range, target.focus)) {
        return true;
      }
      var _Range$edges3 = Range.edges(range),
        _Range$edges4 = _slicedToArray(_Range$edges3, 2),
        rs = _Range$edges4[0],
        re = _Range$edges4[1];
      var _Range$edges5 = Range.edges(target),
        _Range$edges6 = _slicedToArray(_Range$edges5, 2),
        ts = _Range$edges6[0],
        te = _Range$edges6[1];
      return Point.isBefore(rs, ts) && Point.isAfter(re, te);
    }
    var _Range$edges7 = Range.edges(range),
      _Range$edges8 = _slicedToArray(_Range$edges7, 2),
      start = _Range$edges8[0],
      end = _Range$edges8[1];
    var isAfterStart = false;
    var isBeforeEnd = false;
    if (Point.isPoint(target)) {
      isAfterStart = Point.compare(target, start) >= 0;
      isBeforeEnd = Point.compare(target, end) <= 0;
    } else {
      isAfterStart = Path.compare(target, start.path) >= 0;
      isBeforeEnd = Path.compare(target, end.path) <= 0;
    }
    return isAfterStart && isBeforeEnd;
  },
  intersection: function intersection(range, another) {
    range.anchor;
      range.focus;
      var rest = _objectWithoutProperties(range, _excluded$4);
    var _Range$edges9 = Range.edges(range),
      _Range$edges10 = _slicedToArray(_Range$edges9, 2),
      s1 = _Range$edges10[0],
      e1 = _Range$edges10[1];
    var _Range$edges11 = Range.edges(another),
      _Range$edges12 = _slicedToArray(_Range$edges11, 2),
      s2 = _Range$edges12[0],
      e2 = _Range$edges12[1];
    var start = Point.isBefore(s1, s2) ? s2 : s1;
    var end = Point.isBefore(e1, e2) ? e1 : e2;
    if (Point.isBefore(end, start)) {
      return null;
    } else {
      return _objectSpread$d({
        anchor: start,
        focus: end
      }, rest);
    }
  },
  isBackward: function isBackward(range) {
    var anchor = range.anchor,
      focus = range.focus;
    return Point.isAfter(anchor, focus);
  },
  isCollapsed: function isCollapsed(range) {
    var anchor = range.anchor,
      focus = range.focus;
    return Point.equals(anchor, focus);
  },
  isExpanded: function isExpanded(range) {
    return !Range.isCollapsed(range);
  },
  isForward: function isForward(range) {
    return !Range.isBackward(range);
  },
  isRange: function isRange(value) {
    return isPlainObject.isPlainObject(value) && Point.isPoint(value.anchor) && Point.isPoint(value.focus);
  },
  points: function* points(range) {
    yield [range.anchor, 'anchor'];
    yield [range.focus, 'focus'];
  },
  start: function start(range) {
    var _Range$edges13 = Range.edges(range),
      _Range$edges14 = _slicedToArray(_Range$edges13, 1),
      start = _Range$edges14[0];
    return start;
  },
  transform: function transform(range, op) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return immer.produce(range, function (r) {
      if (r === null) {
        return null;
      }
      var _options$affinity = options.affinity,
        affinity = _options$affinity === void 0 ? 'inward' : _options$affinity;
      var affinityAnchor;
      var affinityFocus;
      if (affinity === 'inward') {
        // If the range is collapsed, make sure to use the same affinity to
        // avoid the two points passing each other and expanding in the opposite
        // direction
        var isCollapsed = Range.isCollapsed(r);
        if (Range.isForward(r)) {
          affinityAnchor = 'forward';
          affinityFocus = isCollapsed ? affinityAnchor : 'backward';
        } else {
          affinityAnchor = 'backward';
          affinityFocus = isCollapsed ? affinityAnchor : 'forward';
        }
      } else if (affinity === 'outward') {
        if (Range.isForward(r)) {
          affinityAnchor = 'backward';
          affinityFocus = 'forward';
        } else {
          affinityAnchor = 'forward';
          affinityFocus = 'backward';
        }
      } else {
        affinityAnchor = affinity;
        affinityFocus = affinity;
      }
      var anchor = Point.transform(r.anchor, op, {
        affinity: affinityAnchor
      });
      var focus = Point.transform(r.focus, op, {
        affinity: affinityFocus
      });
      if (!anchor || !focus) {
        return null;
      }
      r.anchor = anchor;
      r.focus = focus;
    });
  }
};

/**
 * Shared the function with isElementType utility
 */
var isElement = function isElement(value) {
  return isPlainObject.isPlainObject(value) && Node.isNodeList(value.children) && !Editor.isEditor(value);
};
// eslint-disable-next-line no-redeclare
var Element = {
  isAncestor: function isAncestor(value) {
    return isPlainObject.isPlainObject(value) && Node.isNodeList(value.children);
  },
  isElement: isElement,
  isElementList: function isElementList(value) {
    return Array.isArray(value) && value.every(function (val) {
      return Element.isElement(val);
    });
  },
  isElementProps: function isElementProps(props) {
    return props.children !== undefined;
  },
  isElementType: function isElementType(value, elementVal) {
    var elementKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'type';
    return isElement(value) && value[elementKey] === elementVal;
  },
  matches: function matches(element, props) {
    for (var key in props) {
      if (key === 'children') {
        continue;
      }
      if (element[key] !== props[key]) {
        return false;
      }
    }
    return true;
  }
};

var _excluded$3 = ["children"],
  _excluded2$3 = ["text"];
function _createForOfIteratorHelper$k(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$k(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$k(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$k(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$k(o, minLen); }
function _arrayLikeToArray$k(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var IS_NODE_LIST_CACHE = new WeakMap();
// eslint-disable-next-line no-redeclare
var Node = {
  ancestor: function ancestor(root, path) {
    var node = Node.get(root, path);
    if (Text.isText(node)) {
      throw new Error("Cannot get the ancestor node at path [".concat(path, "] because it refers to a text node instead: ").concat(Scrubber.stringify(node)));
    }
    return node;
  },
  ancestors: function ancestors(root, path) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function* () {
      var _iterator = _createForOfIteratorHelper$k(Path.ancestors(path, options)),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          var n = Node.ancestor(root, p);
          var entry = [n, p];
          yield entry;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }();
  },
  child: function child(root, index) {
    if (Text.isText(root)) {
      throw new Error("Cannot get the child of a text node: ".concat(Scrubber.stringify(root)));
    }
    var c = root.children[index];
    if (c == null) {
      throw new Error("Cannot get child at index `".concat(index, "` in node: ").concat(Scrubber.stringify(root)));
    }
    return c;
  },
  children: function children(root, path) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function* () {
      var _options$reverse = options.reverse,
        reverse = _options$reverse === void 0 ? false : _options$reverse;
      var ancestor = Node.ancestor(root, path);
      var children = ancestor.children;
      var index = reverse ? children.length - 1 : 0;
      while (reverse ? index >= 0 : index < children.length) {
        var child = Node.child(ancestor, index);
        var childPath = path.concat(index);
        yield [child, childPath];
        index = reverse ? index - 1 : index + 1;
      }
    }();
  },
  common: function common(root, path, another) {
    var p = Path.common(path, another);
    var n = Node.get(root, p);
    return [n, p];
  },
  descendant: function descendant(root, path) {
    var node = Node.get(root, path);
    if (Editor.isEditor(node)) {
      throw new Error("Cannot get the descendant node at path [".concat(path, "] because it refers to the root editor node instead: ").concat(Scrubber.stringify(node)));
    }
    return node;
  },
  descendants: function descendants(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function* () {
      var _iterator2 = _createForOfIteratorHelper$k(Node.nodes(root, options)),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            node = _step2$value[0],
            path = _step2$value[1];
          if (path.length !== 0) {
            // NOTE: we have to coerce here because checking the path's length does
            // guarantee that `node` is not a `Editor`, but TypeScript doesn't know.
            yield [node, path];
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }();
  },
  elements: function elements(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function* () {
      var _iterator3 = _createForOfIteratorHelper$k(Node.nodes(root, options)),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _slicedToArray(_step3.value, 2),
            node = _step3$value[0],
            path = _step3$value[1];
          if (Element.isElement(node)) {
            yield [node, path];
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }();
  },
  extractProps: function extractProps(node) {
    if (Element.isAncestor(node)) {
      node.children;
        var properties = _objectWithoutProperties(node, _excluded$3);
      return properties;
    } else {
      node.text;
        var _properties = _objectWithoutProperties(node, _excluded2$3);
      return _properties;
    }
  },
  first: function first(root, path) {
    var p = path.slice();
    var n = Node.get(root, p);
    while (n) {
      if (Text.isText(n) || n.children.length === 0) {
        break;
      } else {
        n = n.children[0];
        p.push(0);
      }
    }
    return [n, p];
  },
  fragment: function fragment(root, range) {
    if (Text.isText(root)) {
      throw new Error("Cannot get a fragment starting from a root text node: ".concat(Scrubber.stringify(root)));
    }
    var newRoot = immer.produce({
      children: root.children
    }, function (r) {
      var _Range$edges = Range.edges(range),
        _Range$edges2 = _slicedToArray(_Range$edges, 2),
        start = _Range$edges2[0],
        end = _Range$edges2[1];
      var nodeEntries = Node.nodes(r, {
        reverse: true,
        pass: function pass(_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            path = _ref2[1];
          return !Range.includes(range, path);
        }
      });
      var _iterator4 = _createForOfIteratorHelper$k(nodeEntries),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _step4$value = _slicedToArray(_step4.value, 2),
            path = _step4$value[1];
          if (!Range.includes(range, path)) {
            var parent = Node.parent(r, path);
            var index = path[path.length - 1];
            parent.children.splice(index, 1);
          }
          if (Path.equals(path, end.path)) {
            var leaf = Node.leaf(r, path);
            leaf.text = leaf.text.slice(0, end.offset);
          }
          if (Path.equals(path, start.path)) {
            var _leaf = Node.leaf(r, path);
            _leaf.text = _leaf.text.slice(start.offset);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      if (Editor.isEditor(r)) {
        r.selection = null;
      }
    });
    return newRoot.children;
  },
  get: function get(root, path) {
    var node = root;
    for (var i = 0; i < path.length; i++) {
      var p = path[i];
      if (Text.isText(node) || !node.children[p]) {
        throw new Error("Cannot find a descendant at path [".concat(path, "] in node: ").concat(Scrubber.stringify(root)));
      }
      node = node.children[p];
    }
    return node;
  },
  has: function has(root, path) {
    var node = root;
    for (var i = 0; i < path.length; i++) {
      var p = path[i];
      if (Text.isText(node) || !node.children[p]) {
        return false;
      }
      node = node.children[p];
    }
    return true;
  },
  isNode: function isNode(value) {
    return Text.isText(value) || Element.isElement(value) || Editor.isEditor(value);
  },
  isNodeList: function isNodeList(value) {
    if (!Array.isArray(value)) {
      return false;
    }
    var cachedResult = IS_NODE_LIST_CACHE.get(value);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    var isNodeList = value.every(function (val) {
      return Node.isNode(val);
    });
    IS_NODE_LIST_CACHE.set(value, isNodeList);
    return isNodeList;
  },
  last: function last(root, path) {
    var p = path.slice();
    var n = Node.get(root, p);
    while (n) {
      if (Text.isText(n) || n.children.length === 0) {
        break;
      } else {
        var i = n.children.length - 1;
        n = n.children[i];
        p.push(i);
      }
    }
    return [n, p];
  },
  leaf: function leaf(root, path) {
    var node = Node.get(root, path);
    if (!Text.isText(node)) {
      throw new Error("Cannot get the leaf node at path [".concat(path, "] because it refers to a non-leaf node: ").concat(Scrubber.stringify(node)));
    }
    return node;
  },
  levels: function levels(root, path) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function* () {
      var _iterator5 = _createForOfIteratorHelper$k(Path.levels(path, options)),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var p = _step5.value;
          var n = Node.get(root, p);
          yield [n, p];
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }();
  },
  matches: function matches(node, props) {
    return Element.isElement(node) && Element.isElementProps(props) && Element.matches(node, props) || Text.isText(node) && Text.isTextProps(props) && Text.matches(node, props);
  },
  nodes: function nodes(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function* () {
      var pass = options.pass,
        _options$reverse2 = options.reverse,
        reverse = _options$reverse2 === void 0 ? false : _options$reverse2;
      var _options$from = options.from,
        from = _options$from === void 0 ? [] : _options$from,
        to = options.to;
      var visited = new Set();
      var p = [];
      var n = root;
      while (true) {
        if (to && (reverse ? Path.isBefore(p, to) : Path.isAfter(p, to))) {
          break;
        }
        if (!visited.has(n)) {
          yield [n, p];
        }
        // If we're allowed to go downward and we haven't descended yet, do.
        if (!visited.has(n) && !Text.isText(n) && n.children.length !== 0 && (pass == null || pass([n, p]) === false)) {
          visited.add(n);
          var nextIndex = reverse ? n.children.length - 1 : 0;
          if (Path.isAncestor(p, from)) {
            nextIndex = from[p.length];
          }
          p = p.concat(nextIndex);
          n = Node.get(root, p);
          continue;
        }
        // If we're at the root and we can't go down, we're done.
        if (p.length === 0) {
          break;
        }
        // If we're going forward...
        if (!reverse) {
          var newPath = Path.next(p);
          if (Node.has(root, newPath)) {
            p = newPath;
            n = Node.get(root, p);
            continue;
          }
        }
        // If we're going backward...
        if (reverse && p[p.length - 1] !== 0) {
          var _newPath = Path.previous(p);
          p = _newPath;
          n = Node.get(root, p);
          continue;
        }
        // Otherwise we're going upward...
        p = Path.parent(p);
        n = Node.get(root, p);
        visited.add(n);
      }
    }();
  },
  parent: function parent(root, path) {
    var parentPath = Path.parent(path);
    var p = Node.get(root, parentPath);
    if (Text.isText(p)) {
      throw new Error("Cannot get the parent of path [".concat(path, "] because it does not exist in the root."));
    }
    return p;
  },
  string: function string(node) {
    if (Text.isText(node)) {
      return node.text;
    } else {
      return node.children.map(Node.string).join('');
    }
  },
  texts: function texts(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function* () {
      var _iterator6 = _createForOfIteratorHelper$k(Node.nodes(root, options)),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _step6$value = _slicedToArray(_step6.value, 2),
            node = _step6$value[0],
            path = _step6$value[1];
          if (Text.isText(node)) {
            yield [node, path];
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }();
  }
};

function ownKeys$c(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$c(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$c(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$c(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// eslint-disable-next-line no-redeclare
var Operation = {
  isNodeOperation: function isNodeOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith('_node');
  },
  isOperation: function isOperation(value) {
    if (!isPlainObject.isPlainObject(value)) {
      return false;
    }
    switch (value.type) {
      case 'insert_node':
        return Path.isPath(value.path) && Node.isNode(value.node);
      case 'insert_text':
        return typeof value.offset === 'number' && typeof value.text === 'string' && Path.isPath(value.path);
      case 'merge_node':
        return typeof value.position === 'number' && Path.isPath(value.path) && isPlainObject.isPlainObject(value.properties);
      case 'move_node':
        return Path.isPath(value.path) && Path.isPath(value.newPath);
      case 'remove_node':
        return Path.isPath(value.path) && Node.isNode(value.node);
      case 'remove_text':
        return typeof value.offset === 'number' && typeof value.text === 'string' && Path.isPath(value.path);
      case 'set_node':
        return Path.isPath(value.path) && isPlainObject.isPlainObject(value.properties) && isPlainObject.isPlainObject(value.newProperties);
      case 'set_selection':
        return value.properties === null && Range.isRange(value.newProperties) || value.newProperties === null && Range.isRange(value.properties) || isPlainObject.isPlainObject(value.properties) && isPlainObject.isPlainObject(value.newProperties);
      case 'split_node':
        return Path.isPath(value.path) && typeof value.position === 'number' && isPlainObject.isPlainObject(value.properties);
      default:
        return false;
    }
  },
  isOperationList: function isOperationList(value) {
    return Array.isArray(value) && value.every(function (val) {
      return Operation.isOperation(val);
    });
  },
  isSelectionOperation: function isSelectionOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith('_selection');
  },
  isTextOperation: function isTextOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith('_text');
  },
  inverse: function inverse(op) {
    switch (op.type) {
      case 'insert_node':
        {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            type: 'remove_node'
          });
        }
      case 'insert_text':
        {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            type: 'remove_text'
          });
        }
      case 'merge_node':
        {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            type: 'split_node',
            path: Path.previous(op.path)
          });
        }
      case 'move_node':
        {
          var newPath = op.newPath,
            path = op.path;
          // PERF: in this case the move operation is a no-op anyways.
          if (Path.equals(newPath, path)) {
            return op;
          }
          // If the move happens completely within a single parent the path and
          // newPath are stable with respect to each other.
          if (Path.isSibling(path, newPath)) {
            return _objectSpread$c(_objectSpread$c({}, op), {}, {
              path: newPath,
              newPath: path
            });
          }
          // If the move does not happen within a single parent it is possible
          // for the move to impact the true path to the location where the node
          // was removed from and where it was inserted. We have to adjust for this
          // and find the original path. We can accomplish this (only in non-sibling)
          // moves by looking at the impact of the move operation on the node
          // after the original move path.
          var inversePath = Path.transform(path, op);
          var inverseNewPath = Path.transform(Path.next(path), op);
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            path: inversePath,
            newPath: inverseNewPath
          });
        }
      case 'remove_node':
        {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            type: 'insert_node'
          });
        }
      case 'remove_text':
        {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            type: 'insert_text'
          });
        }
      case 'set_node':
        {
          var properties = op.properties,
            newProperties = op.newProperties;
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            properties: newProperties,
            newProperties: properties
          });
        }
      case 'set_selection':
        {
          var _properties = op.properties,
            _newProperties = op.newProperties;
          if (_properties == null) {
            return _objectSpread$c(_objectSpread$c({}, op), {}, {
              properties: _newProperties,
              newProperties: null
            });
          } else if (_newProperties == null) {
            return _objectSpread$c(_objectSpread$c({}, op), {}, {
              properties: null,
              newProperties: _properties
            });
          } else {
            return _objectSpread$c(_objectSpread$c({}, op), {}, {
              properties: _newProperties,
              newProperties: _properties
            });
          }
        }
      case 'split_node':
        {
          return _objectSpread$c(_objectSpread$c({}, op), {}, {
            type: 'merge_node',
            path: Path.next(op.path)
          });
        }
    }
  }
};

var IS_EDITOR_CACHE = new WeakMap();
var isEditor = function isEditor(value) {
  var cachedIsEditor = IS_EDITOR_CACHE.get(value);
  if (cachedIsEditor !== undefined) {
    return cachedIsEditor;
  }
  if (!isPlainObject.isPlainObject(value)) {
    return false;
  }
  var isEditor = typeof value.addMark === 'function' && typeof value.apply === 'function' && typeof value.deleteFragment === 'function' && typeof value.insertBreak === 'function' && typeof value.insertSoftBreak === 'function' && typeof value.insertFragment === 'function' && typeof value.insertNode === 'function' && typeof value.insertText === 'function' && typeof value.isElementReadOnly === 'function' && typeof value.isInline === 'function' && typeof value.isSelectable === 'function' && typeof value.isVoid === 'function' && typeof value.normalizeNode === 'function' && typeof value.onChange === 'function' && typeof value.removeMark === 'function' && typeof value.getDirtyPaths === 'function' && (value.marks === null || isPlainObject.isPlainObject(value.marks)) && (value.selection === null || Range.isRange(value.selection)) && Node.isNodeList(value.children) && Operation.isOperationList(value.operations);
  IS_EDITOR_CACHE.set(value, isEditor);
  return isEditor;
};

// eslint-disable-next-line no-redeclare
var Editor = {
  above: function above(editor, options) {
    return editor.above(options);
  },
  addMark: function addMark(editor, key, value) {
    editor.addMark(key, value);
  },
  after: function after(editor, at, options) {
    return editor.after(at, options);
  },
  before: function before(editor, at, options) {
    return editor.before(at, options);
  },
  deleteBackward: function deleteBackward(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$unit = options.unit,
      unit = _options$unit === void 0 ? 'character' : _options$unit;
    editor.deleteBackward(unit);
  },
  deleteForward: function deleteForward(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$unit2 = options.unit,
      unit = _options$unit2 === void 0 ? 'character' : _options$unit2;
    editor.deleteForward(unit);
  },
  deleteFragment: function deleteFragment(editor, options) {
    editor.deleteFragment(options);
  },
  edges: function edges(editor, at) {
    return editor.edges(at);
  },
  elementReadOnly: function elementReadOnly(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return editor.elementReadOnly(options);
  },
  end: function end(editor, at) {
    return editor.end(at);
  },
  first: function first(editor, at) {
    return editor.first(at);
  },
  fragment: function fragment(editor, at) {
    return editor.fragment(at);
  },
  hasBlocks: function hasBlocks(editor, element) {
    return editor.hasBlocks(element);
  },
  hasInlines: function hasInlines(editor, element) {
    return editor.hasInlines(element);
  },
  hasPath: function hasPath(editor, path) {
    return editor.hasPath(path);
  },
  hasTexts: function hasTexts(editor, element) {
    return editor.hasTexts(element);
  },
  insertBreak: function insertBreak(editor) {
    editor.insertBreak();
  },
  insertFragment: function insertFragment(editor, fragment, options) {
    editor.insertFragment(fragment, options);
  },
  insertNode: function insertNode(editor, node) {
    editor.insertNode(node);
  },
  insertSoftBreak: function insertSoftBreak(editor) {
    editor.insertSoftBreak();
  },
  insertText: function insertText(editor, text) {
    editor.insertText(text);
  },
  isBlock: function isBlock(editor, value) {
    return editor.isBlock(value);
  },
  isEdge: function isEdge(editor, point, at) {
    return editor.isEdge(point, at);
  },
  isEditor: function isEditor$1(value) {
    return isEditor(value);
  },
  isElementReadOnly: function isElementReadOnly(editor, element) {
    return editor.isElementReadOnly(element);
  },
  isEmpty: function isEmpty(editor, element) {
    return editor.isEmpty(element);
  },
  isEnd: function isEnd(editor, point, at) {
    return editor.isEnd(point, at);
  },
  isInline: function isInline(editor, value) {
    return editor.isInline(value);
  },
  isNormalizing: function isNormalizing(editor) {
    return editor.isNormalizing();
  },
  isSelectable: function isSelectable(editor, value) {
    return editor.isSelectable(value);
  },
  isStart: function isStart(editor, point, at) {
    return editor.isStart(point, at);
  },
  isVoid: function isVoid(editor, value) {
    return editor.isVoid(value);
  },
  last: function last(editor, at) {
    return editor.last(at);
  },
  leaf: function leaf(editor, at, options) {
    return editor.leaf(at, options);
  },
  levels: function levels(editor, options) {
    return editor.levels(options);
  },
  marks: function marks(editor) {
    return editor.getMarks();
  },
  next: function next(editor, options) {
    return editor.next(options);
  },
  node: function node(editor, at, options) {
    return editor.node(at, options);
  },
  nodes: function nodes(editor, options) {
    return editor.nodes(options);
  },
  normalize: function normalize(editor, options) {
    editor.normalize(options);
  },
  parent: function parent(editor, at, options) {
    return editor.parent(at, options);
  },
  path: function path(editor, at, options) {
    return editor.path(at, options);
  },
  pathRef: function pathRef(editor, path, options) {
    return editor.pathRef(path, options);
  },
  pathRefs: function pathRefs(editor) {
    return editor.pathRefs();
  },
  point: function point(editor, at, options) {
    return editor.point(at, options);
  },
  pointRef: function pointRef(editor, point, options) {
    return editor.pointRef(point, options);
  },
  pointRefs: function pointRefs(editor) {
    return editor.pointRefs();
  },
  positions: function positions(editor, options) {
    return editor.positions(options);
  },
  previous: function previous(editor, options) {
    return editor.previous(options);
  },
  range: function range(editor, at, to) {
    return editor.range(at, to);
  },
  rangeRef: function rangeRef(editor, range, options) {
    return editor.rangeRef(range, options);
  },
  rangeRefs: function rangeRefs(editor) {
    return editor.rangeRefs();
  },
  removeMark: function removeMark(editor, key) {
    editor.removeMark(key);
  },
  setNormalizing: function setNormalizing(editor, isNormalizing) {
    editor.setNormalizing(isNormalizing);
  },
  start: function start(editor, at) {
    return editor.start(at);
  },
  string: function string(editor, at, options) {
    return editor.string(at, options);
  },
  unhangRange: function unhangRange(editor, range, options) {
    return editor.unhangRange(range, options);
  },
  "void": function _void(editor, options) {
    return editor["void"](options);
  },
  withoutNormalizing: function withoutNormalizing(editor, fn) {
    editor.withoutNormalizing(fn);
  }
};

// eslint-disable-next-line no-redeclare
var Location = {
  isLocation: function isLocation(value) {
    return Path.isPath(value) || Point.isPoint(value) || Range.isRange(value);
  }
};
// eslint-disable-next-line no-redeclare
var Span = {
  isSpan: function isSpan(value) {
    return Array.isArray(value) && value.length === 2 && value.every(Path.isPath);
  }
};

function ownKeys$b(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$b(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$b(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$b(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// eslint-disable-next-line no-redeclare
var Point = {
  compare: function compare(point, another) {
    var result = Path.compare(point.path, another.path);
    if (result === 0) {
      if (point.offset < another.offset) return -1;
      if (point.offset > another.offset) return 1;
      return 0;
    }
    return result;
  },
  isAfter: function isAfter(point, another) {
    return Point.compare(point, another) === 1;
  },
  isBefore: function isBefore(point, another) {
    return Point.compare(point, another) === -1;
  },
  equals: function equals(point, another) {
    // PERF: ensure the offsets are equal first since they are cheaper to check.
    return point.offset === another.offset && Path.equals(point.path, another.path);
  },
  isPoint: function isPoint(value) {
    return isPlainObject.isPlainObject(value) && typeof value.offset === 'number' && Path.isPath(value.path);
  },
  transform: function transform(point, op) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return immer.produce(point, function (p) {
      if (p === null) {
        return null;
      }
      var _options$affinity = options.affinity,
        affinity = _options$affinity === void 0 ? 'forward' : _options$affinity;
      var path = p.path,
        offset = p.offset;
      switch (op.type) {
        case 'insert_node':
        case 'move_node':
          {
            p.path = Path.transform(path, op, options);
            break;
          }
        case 'insert_text':
          {
            if (Path.equals(op.path, path) && (op.offset < offset || op.offset === offset && affinity === 'forward')) {
              p.offset += op.text.length;
            }
            break;
          }
        case 'merge_node':
          {
            if (Path.equals(op.path, path)) {
              p.offset += op.position;
            }
            p.path = Path.transform(path, op, options);
            break;
          }
        case 'remove_text':
          {
            if (Path.equals(op.path, path) && op.offset <= offset) {
              p.offset -= Math.min(offset - op.offset, op.text.length);
            }
            break;
          }
        case 'remove_node':
          {
            if (Path.equals(op.path, path) || Path.isAncestor(op.path, path)) {
              return null;
            }
            p.path = Path.transform(path, op, options);
            break;
          }
        case 'split_node':
          {
            if (Path.equals(op.path, path)) {
              if (op.position === offset && affinity == null) {
                return null;
              } else if (op.position < offset || op.position === offset && affinity === 'forward') {
                p.offset -= op.position;
                p.path = Path.transform(path, op, _objectSpread$b(_objectSpread$b({}, options), {}, {
                  affinity: 'forward'
                }));
              }
            } else {
              p.path = Path.transform(path, op, options);
            }
            break;
          }
      }
    });
  }
};

var _scrubber = undefined;
/**
 * This interface implements a stringify() function, which is used by Slate
 * internally when generating exceptions containing end user data. Developers
 * using Slate may call Scrubber.setScrubber() to alter the behavior of this
 * stringify() function.
 *
 * For example, to prevent the cleartext logging of 'text' fields within Nodes:
 *
 *    import { Scrubber } from 'slate';
 *    Scrubber.setScrubber((key, val) => {
 *      if (key === 'text') return '...scrubbed...'
 *      return val
 *    });
 *
 */
// eslint-disable-next-line no-redeclare
var Scrubber = {
  setScrubber: function setScrubber(scrubber) {
    _scrubber = scrubber;
  },
  stringify: function stringify(value) {
    return JSON.stringify(value, _scrubber);
  }
};

var _excluded$2 = ["text"],
  _excluded2$2 = ["anchor", "focus"];
function _createForOfIteratorHelper$j(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$j(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$j(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$j(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$j(o, minLen); }
function _arrayLikeToArray$j(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$a(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$a(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$a(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$a(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// eslint-disable-next-line no-redeclare
var Text = {
  equals: function equals(text, another) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _options$loose = options.loose,
      loose = _options$loose === void 0 ? false : _options$loose;
    function omitText(obj) {
      obj.text;
        var rest = _objectWithoutProperties(obj, _excluded$2);
      return rest;
    }
    return isDeepEqual(loose ? omitText(text) : text, loose ? omitText(another) : another);
  },
  isText: function isText(value) {
    return isPlainObject.isPlainObject(value) && typeof value.text === 'string';
  },
  isTextList: function isTextList(value) {
    return Array.isArray(value) && value.every(function (val) {
      return Text.isText(val);
    });
  },
  isTextProps: function isTextProps(props) {
    return props.text !== undefined;
  },
  matches: function matches(text, props) {
    for (var key in props) {
      if (key === 'text') {
        continue;
      }
      if (!text.hasOwnProperty(key) || text[key] !== props[key]) {
        return false;
      }
    }
    return true;
  },
  decorations: function decorations(node, _decorations) {
    var leaves = [_objectSpread$a({}, node)];
    var _iterator = _createForOfIteratorHelper$j(_decorations),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var dec = _step.value;
        var anchor = dec.anchor,
          focus = dec.focus,
          rest = _objectWithoutProperties(dec, _excluded2$2);
        var _Range$edges = Range.edges(dec),
          _Range$edges2 = _slicedToArray(_Range$edges, 2),
          start = _Range$edges2[0],
          end = _Range$edges2[1];
        var next = [];
        var leafEnd = 0;
        var decorationStart = start.offset;
        var decorationEnd = end.offset;
        var _iterator2 = _createForOfIteratorHelper$j(leaves),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var leaf = _step2.value;
            var length = leaf.text.length;
            var leafStart = leafEnd;
            leafEnd += length;
            // If the range encompasses the entire leaf, add the range.
            if (decorationStart <= leafStart && leafEnd <= decorationEnd) {
              Object.assign(leaf, rest);
              next.push(leaf);
              continue;
            }
            // If the range expanded and match the leaf, or starts after, or ends before it, continue.
            if (decorationStart !== decorationEnd && (decorationStart === leafEnd || decorationEnd === leafStart) || decorationStart > leafEnd || decorationEnd < leafStart || decorationEnd === leafStart && leafStart !== 0) {
              next.push(leaf);
              continue;
            }
            // Otherwise we need to split the leaf, at the start, end, or both,
            // and add the range to the middle intersecting section. Do the end
            // split first since we don't need to update the offset that way.
            var middle = leaf;
            var before = void 0;
            var after = void 0;
            if (decorationEnd < leafEnd) {
              var off = decorationEnd - leafStart;
              after = _objectSpread$a(_objectSpread$a({}, middle), {}, {
                text: middle.text.slice(off)
              });
              middle = _objectSpread$a(_objectSpread$a({}, middle), {}, {
                text: middle.text.slice(0, off)
              });
            }
            if (decorationStart > leafStart) {
              var _off = decorationStart - leafStart;
              before = _objectSpread$a(_objectSpread$a({}, middle), {}, {
                text: middle.text.slice(0, _off)
              });
              middle = _objectSpread$a(_objectSpread$a({}, middle), {}, {
                text: middle.text.slice(_off)
              });
            }
            Object.assign(middle, rest);
            if (before) {
              next.push(before);
            }
            next.push(middle);
            if (after) {
              next.push(after);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        leaves = next;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return leaves;
  }
};

/**
 * Get the default location to insert content into the editor.
 * By default, use the selection as the target location. But if there is
 * no selection, insert at the end of the document since that is such a
 * common use case when inserting from a non-selected state.
 */
var getDefaultInsertLocation = function getDefaultInsertLocation(editor) {
  if (editor.selection) {
    return editor.selection;
  } else if (editor.children.length > 0) {
    return Editor.end(editor, []);
  } else {
    return [0];
  }
};

var matchPath = function matchPath(editor, path) {
  var _Editor$node = Editor.node(editor, path),
    _Editor$node2 = _slicedToArray(_Editor$node, 1),
    node = _Editor$node2[0];
  return function (n) {
    return n === node;
  };
};

function _createForOfIteratorHelper$i(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$i(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$i(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$i(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$i(o, minLen); }
function _arrayLikeToArray$i(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// Character (grapheme cluster) boundaries are determined according to
// the default grapheme cluster boundary specification, extended grapheme clusters variant[1].
//
// References:
//
// [1] https://www.unicode.org/reports/tr29/#Default_Grapheme_Cluster_Table
// [2] https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/GraphemeBreakProperty.txt
// [3] https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/GraphemeBreakTest.html
// [4] https://www.unicode.org/Public/UCD/latest/ucd/auxiliary/GraphemeBreakTest.txt
/**
 * Get the distance to the end of the first character in a string of text.
 */
var getCharacterDistance = function getCharacterDistance(str) {
  var isRTL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var isLTR = !isRTL;
  var codepoints = isRTL ? codepointsIteratorRTL(str) : str;
  var left = CodepointType.None;
  var right = CodepointType.None;
  var distance = 0;
  // Evaluation of these conditions are deferred.
  var gb11 = null; // Is GB11 applicable?
  var gb12Or13 = null; // Is GB12 or GB13 applicable?
  var _iterator = _createForOfIteratorHelper$i(codepoints),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _char = _step.value;
      var code = _char.codePointAt(0);
      if (!code) break;
      var type = getCodepointType(_char, code);
      var _ref = isLTR ? [right, type] : [type, left];
      var _ref2 = _slicedToArray(_ref, 2);
      left = _ref2[0];
      right = _ref2[1];
      if (intersects(left, CodepointType.ZWJ) && intersects(right, CodepointType.ExtPict)) {
        if (isLTR) {
          gb11 = endsWithEmojiZWJ(str.substring(0, distance));
        } else {
          gb11 = endsWithEmojiZWJ(str.substring(0, str.length - distance));
        }
        if (!gb11) break;
      }
      if (intersects(left, CodepointType.RI) && intersects(right, CodepointType.RI)) {
        if (gb12Or13 !== null) {
          gb12Or13 = !gb12Or13;
        } else {
          if (isLTR) {
            gb12Or13 = true;
          } else {
            gb12Or13 = endsWithOddNumberOfRIs(str.substring(0, str.length - distance));
          }
        }
        if (!gb12Or13) break;
      }
      if (left !== CodepointType.None && right !== CodepointType.None && isBoundaryPair(left, right)) {
        break;
      }
      distance += _char.length;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return distance || 1;
};
var SPACE = /\s/;
var PUNCTUATION = /[\u002B\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
var CHAMELEON = /['\u2018\u2019]/;
/**
 * Get the distance to the end of the first word in a string of text.
 */
var getWordDistance = function getWordDistance(text) {
  var isRTL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dist = 0;
  var started = false;
  while (text.length > 0) {
    var charDist = getCharacterDistance(text, isRTL);
    var _splitByCharacterDist = splitByCharacterDistance(text, charDist, isRTL),
      _splitByCharacterDist2 = _slicedToArray(_splitByCharacterDist, 2),
      _char2 = _splitByCharacterDist2[0],
      remaining = _splitByCharacterDist2[1];
    if (isWordCharacter(_char2, remaining, isRTL)) {
      started = true;
      dist += charDist;
    } else if (!started) {
      dist += charDist;
    } else {
      break;
    }
    text = remaining;
  }
  return dist;
};
/**
 * Split a string in two parts at a given distance starting from the end when
 * `isRTL` is set to `true`.
 */
var splitByCharacterDistance = function splitByCharacterDistance(str, dist, isRTL) {
  if (isRTL) {
    var at = str.length - dist;
    return [str.slice(at, str.length), str.slice(0, at)];
  }
  return [str.slice(0, dist), str.slice(dist)];
};
/**
 * Check if a character is a word character. The `remaining` argument is used
 * because sometimes you must read subsequent characters to truly determine it.
 */
var isWordCharacter = function isWordCharacter(_char3, remaining) {
  var isRTL = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (SPACE.test(_char3)) {
    return false;
  }
  // Chameleons count as word characters as long as they're in a word, so
  // recurse to see if the next one is a word character or not.
  if (CHAMELEON.test(_char3)) {
    var charDist = getCharacterDistance(remaining, isRTL);
    var _splitByCharacterDist3 = splitByCharacterDistance(remaining, charDist, isRTL),
      _splitByCharacterDist4 = _slicedToArray(_splitByCharacterDist3, 2),
      nextChar = _splitByCharacterDist4[0],
      nextRemaining = _splitByCharacterDist4[1];
    if (isWordCharacter(nextChar, nextRemaining, isRTL)) {
      return true;
    }
  }
  if (PUNCTUATION.test(_char3)) {
    return false;
  }
  return true;
};
/**
 * Iterate on codepoints from right to left.
 */
var codepointsIteratorRTL = function* codepointsIteratorRTL(str) {
  var end = str.length - 1;
  for (var i = 0; i < str.length; i++) {
    var char1 = str.charAt(end - i);
    if (isLowSurrogate(char1.charCodeAt(0))) {
      var char2 = str.charAt(end - i - 1);
      if (isHighSurrogate(char2.charCodeAt(0))) {
        yield char2 + char1;
        i++;
        continue;
      }
    }
    yield char1;
  }
};
/**
 * Is `charCode` a high surrogate.
 *
 * https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates
 */
var isHighSurrogate = function isHighSurrogate(charCode) {
  return charCode >= 0xd800 && charCode <= 0xdbff;
};
/**
 * Is `charCode` a low surrogate.
 *
 * https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates
 */
var isLowSurrogate = function isLowSurrogate(charCode) {
  return charCode >= 0xdc00 && charCode <= 0xdfff;
};
var CodepointType;
(function (CodepointType) {
  CodepointType[CodepointType["None"] = 0] = "None";
  CodepointType[CodepointType["Extend"] = 1] = "Extend";
  CodepointType[CodepointType["ZWJ"] = 2] = "ZWJ";
  CodepointType[CodepointType["RI"] = 4] = "RI";
  CodepointType[CodepointType["Prepend"] = 8] = "Prepend";
  CodepointType[CodepointType["SpacingMark"] = 16] = "SpacingMark";
  CodepointType[CodepointType["L"] = 32] = "L";
  CodepointType[CodepointType["V"] = 64] = "V";
  CodepointType[CodepointType["T"] = 128] = "T";
  CodepointType[CodepointType["LV"] = 256] = "LV";
  CodepointType[CodepointType["LVT"] = 512] = "LVT";
  CodepointType[CodepointType["ExtPict"] = 1024] = "ExtPict";
  CodepointType[CodepointType["Any"] = 2048] = "Any";
})(CodepointType || (CodepointType = {}));
var reExtend = /^(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])$/;
var rePrepend = /^(?:[\u0600-\u0605\u06DD\u070F\u0890\u0891\u08E2\u0D4E]|\uD804[\uDCBD\uDCCD\uDDC2\uDDC3]|\uD806[\uDD3F\uDD41\uDE3A\uDE84-\uDE89]|\uD807\uDD46)$/;
var reSpacingMark = /^(?:[\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BF\u09C0\u09C7\u09C8\u09CB\u09CC\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0\u0CC1\u0CC3\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0D02\u0D03\u0D3F\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D82\u0D83\u0DD0\u0DD1\u0DD8-\u0DDE\u0DF2\u0DF3\u0E33\u0EB3\u0F3E\u0F3F\u0F7F\u1031\u103B\u103C\u1056\u1057\u1084\u1715\u1734\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A6D-\u1A72\u1B04\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF7\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC]|\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD45\uDD46\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDDCE\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF62\uDF63]|\uD805[\uDC35-\uDC37\uDC40\uDC41\uDC45\uDCB1\uDCB2\uDCB9\uDCBB\uDCBC\uDCBE\uDCC1\uDDB0\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF26]|\uD806[\uDC2C-\uDC2E\uDC38\uDD31-\uDD35\uDD37\uDD38\uDD3D\uDD40\uDD42\uDDD1-\uDDD3\uDDDC-\uDDDF\uDDE4\uDE39\uDE57\uDE58\uDE97]|\uD807[\uDC2F\uDC3E\uDCA9\uDCB1\uDCB4\uDD8A-\uDD8E\uDD93\uDD94\uDD96\uDEF5\uDEF6]|\uD81B[\uDF51-\uDF87\uDFF0\uDFF1]|\uD834[\uDD66\uDD6D])$/;
var reL = /^[\u1100-\u115F\uA960-\uA97C]$/;
var reV = /^[\u1160-\u11A7\uD7B0-\uD7C6]$/;
var reT = /^[\u11A8-\u11FF\uD7CB-\uD7FB]$/;
var reLV = /^[\uAC00\uAC1C\uAC38\uAC54\uAC70\uAC8C\uACA8\uACC4\uACE0\uACFC\uAD18\uAD34\uAD50\uAD6C\uAD88\uADA4\uADC0\uADDC\uADF8\uAE14\uAE30\uAE4C\uAE68\uAE84\uAEA0\uAEBC\uAED8\uAEF4\uAF10\uAF2C\uAF48\uAF64\uAF80\uAF9C\uAFB8\uAFD4\uAFF0\uB00C\uB028\uB044\uB060\uB07C\uB098\uB0B4\uB0D0\uB0EC\uB108\uB124\uB140\uB15C\uB178\uB194\uB1B0\uB1CC\uB1E8\uB204\uB220\uB23C\uB258\uB274\uB290\uB2AC\uB2C8\uB2E4\uB300\uB31C\uB338\uB354\uB370\uB38C\uB3A8\uB3C4\uB3E0\uB3FC\uB418\uB434\uB450\uB46C\uB488\uB4A4\uB4C0\uB4DC\uB4F8\uB514\uB530\uB54C\uB568\uB584\uB5A0\uB5BC\uB5D8\uB5F4\uB610\uB62C\uB648\uB664\uB680\uB69C\uB6B8\uB6D4\uB6F0\uB70C\uB728\uB744\uB760\uB77C\uB798\uB7B4\uB7D0\uB7EC\uB808\uB824\uB840\uB85C\uB878\uB894\uB8B0\uB8CC\uB8E8\uB904\uB920\uB93C\uB958\uB974\uB990\uB9AC\uB9C8\uB9E4\uBA00\uBA1C\uBA38\uBA54\uBA70\uBA8C\uBAA8\uBAC4\uBAE0\uBAFC\uBB18\uBB34\uBB50\uBB6C\uBB88\uBBA4\uBBC0\uBBDC\uBBF8\uBC14\uBC30\uBC4C\uBC68\uBC84\uBCA0\uBCBC\uBCD8\uBCF4\uBD10\uBD2C\uBD48\uBD64\uBD80\uBD9C\uBDB8\uBDD4\uBDF0\uBE0C\uBE28\uBE44\uBE60\uBE7C\uBE98\uBEB4\uBED0\uBEEC\uBF08\uBF24\uBF40\uBF5C\uBF78\uBF94\uBFB0\uBFCC\uBFE8\uC004\uC020\uC03C\uC058\uC074\uC090\uC0AC\uC0C8\uC0E4\uC100\uC11C\uC138\uC154\uC170\uC18C\uC1A8\uC1C4\uC1E0\uC1FC\uC218\uC234\uC250\uC26C\uC288\uC2A4\uC2C0\uC2DC\uC2F8\uC314\uC330\uC34C\uC368\uC384\uC3A0\uC3BC\uC3D8\uC3F4\uC410\uC42C\uC448\uC464\uC480\uC49C\uC4B8\uC4D4\uC4F0\uC50C\uC528\uC544\uC560\uC57C\uC598\uC5B4\uC5D0\uC5EC\uC608\uC624\uC640\uC65C\uC678\uC694\uC6B0\uC6CC\uC6E8\uC704\uC720\uC73C\uC758\uC774\uC790\uC7AC\uC7C8\uC7E4\uC800\uC81C\uC838\uC854\uC870\uC88C\uC8A8\uC8C4\uC8E0\uC8FC\uC918\uC934\uC950\uC96C\uC988\uC9A4\uC9C0\uC9DC\uC9F8\uCA14\uCA30\uCA4C\uCA68\uCA84\uCAA0\uCABC\uCAD8\uCAF4\uCB10\uCB2C\uCB48\uCB64\uCB80\uCB9C\uCBB8\uCBD4\uCBF0\uCC0C\uCC28\uCC44\uCC60\uCC7C\uCC98\uCCB4\uCCD0\uCCEC\uCD08\uCD24\uCD40\uCD5C\uCD78\uCD94\uCDB0\uCDCC\uCDE8\uCE04\uCE20\uCE3C\uCE58\uCE74\uCE90\uCEAC\uCEC8\uCEE4\uCF00\uCF1C\uCF38\uCF54\uCF70\uCF8C\uCFA8\uCFC4\uCFE0\uCFFC\uD018\uD034\uD050\uD06C\uD088\uD0A4\uD0C0\uD0DC\uD0F8\uD114\uD130\uD14C\uD168\uD184\uD1A0\uD1BC\uD1D8\uD1F4\uD210\uD22C\uD248\uD264\uD280\uD29C\uD2B8\uD2D4\uD2F0\uD30C\uD328\uD344\uD360\uD37C\uD398\uD3B4\uD3D0\uD3EC\uD408\uD424\uD440\uD45C\uD478\uD494\uD4B0\uD4CC\uD4E8\uD504\uD520\uD53C\uD558\uD574\uD590\uD5AC\uD5C8\uD5E4\uD600\uD61C\uD638\uD654\uD670\uD68C\uD6A8\uD6C4\uD6E0\uD6FC\uD718\uD734\uD750\uD76C\uD788]$/;
var reLVT = /^[\uAC01-\uAC1B\uAC1D-\uAC37\uAC39-\uAC53\uAC55-\uAC6F\uAC71-\uAC8B\uAC8D-\uACA7\uACA9-\uACC3\uACC5-\uACDF\uACE1-\uACFB\uACFD-\uAD17\uAD19-\uAD33\uAD35-\uAD4F\uAD51-\uAD6B\uAD6D-\uAD87\uAD89-\uADA3\uADA5-\uADBF\uADC1-\uADDB\uADDD-\uADF7\uADF9-\uAE13\uAE15-\uAE2F\uAE31-\uAE4B\uAE4D-\uAE67\uAE69-\uAE83\uAE85-\uAE9F\uAEA1-\uAEBB\uAEBD-\uAED7\uAED9-\uAEF3\uAEF5-\uAF0F\uAF11-\uAF2B\uAF2D-\uAF47\uAF49-\uAF63\uAF65-\uAF7F\uAF81-\uAF9B\uAF9D-\uAFB7\uAFB9-\uAFD3\uAFD5-\uAFEF\uAFF1-\uB00B\uB00D-\uB027\uB029-\uB043\uB045-\uB05F\uB061-\uB07B\uB07D-\uB097\uB099-\uB0B3\uB0B5-\uB0CF\uB0D1-\uB0EB\uB0ED-\uB107\uB109-\uB123\uB125-\uB13F\uB141-\uB15B\uB15D-\uB177\uB179-\uB193\uB195-\uB1AF\uB1B1-\uB1CB\uB1CD-\uB1E7\uB1E9-\uB203\uB205-\uB21F\uB221-\uB23B\uB23D-\uB257\uB259-\uB273\uB275-\uB28F\uB291-\uB2AB\uB2AD-\uB2C7\uB2C9-\uB2E3\uB2E5-\uB2FF\uB301-\uB31B\uB31D-\uB337\uB339-\uB353\uB355-\uB36F\uB371-\uB38B\uB38D-\uB3A7\uB3A9-\uB3C3\uB3C5-\uB3DF\uB3E1-\uB3FB\uB3FD-\uB417\uB419-\uB433\uB435-\uB44F\uB451-\uB46B\uB46D-\uB487\uB489-\uB4A3\uB4A5-\uB4BF\uB4C1-\uB4DB\uB4DD-\uB4F7\uB4F9-\uB513\uB515-\uB52F\uB531-\uB54B\uB54D-\uB567\uB569-\uB583\uB585-\uB59F\uB5A1-\uB5BB\uB5BD-\uB5D7\uB5D9-\uB5F3\uB5F5-\uB60F\uB611-\uB62B\uB62D-\uB647\uB649-\uB663\uB665-\uB67F\uB681-\uB69B\uB69D-\uB6B7\uB6B9-\uB6D3\uB6D5-\uB6EF\uB6F1-\uB70B\uB70D-\uB727\uB729-\uB743\uB745-\uB75F\uB761-\uB77B\uB77D-\uB797\uB799-\uB7B3\uB7B5-\uB7CF\uB7D1-\uB7EB\uB7ED-\uB807\uB809-\uB823\uB825-\uB83F\uB841-\uB85B\uB85D-\uB877\uB879-\uB893\uB895-\uB8AF\uB8B1-\uB8CB\uB8CD-\uB8E7\uB8E9-\uB903\uB905-\uB91F\uB921-\uB93B\uB93D-\uB957\uB959-\uB973\uB975-\uB98F\uB991-\uB9AB\uB9AD-\uB9C7\uB9C9-\uB9E3\uB9E5-\uB9FF\uBA01-\uBA1B\uBA1D-\uBA37\uBA39-\uBA53\uBA55-\uBA6F\uBA71-\uBA8B\uBA8D-\uBAA7\uBAA9-\uBAC3\uBAC5-\uBADF\uBAE1-\uBAFB\uBAFD-\uBB17\uBB19-\uBB33\uBB35-\uBB4F\uBB51-\uBB6B\uBB6D-\uBB87\uBB89-\uBBA3\uBBA5-\uBBBF\uBBC1-\uBBDB\uBBDD-\uBBF7\uBBF9-\uBC13\uBC15-\uBC2F\uBC31-\uBC4B\uBC4D-\uBC67\uBC69-\uBC83\uBC85-\uBC9F\uBCA1-\uBCBB\uBCBD-\uBCD7\uBCD9-\uBCF3\uBCF5-\uBD0F\uBD11-\uBD2B\uBD2D-\uBD47\uBD49-\uBD63\uBD65-\uBD7F\uBD81-\uBD9B\uBD9D-\uBDB7\uBDB9-\uBDD3\uBDD5-\uBDEF\uBDF1-\uBE0B\uBE0D-\uBE27\uBE29-\uBE43\uBE45-\uBE5F\uBE61-\uBE7B\uBE7D-\uBE97\uBE99-\uBEB3\uBEB5-\uBECF\uBED1-\uBEEB\uBEED-\uBF07\uBF09-\uBF23\uBF25-\uBF3F\uBF41-\uBF5B\uBF5D-\uBF77\uBF79-\uBF93\uBF95-\uBFAF\uBFB1-\uBFCB\uBFCD-\uBFE7\uBFE9-\uC003\uC005-\uC01F\uC021-\uC03B\uC03D-\uC057\uC059-\uC073\uC075-\uC08F\uC091-\uC0AB\uC0AD-\uC0C7\uC0C9-\uC0E3\uC0E5-\uC0FF\uC101-\uC11B\uC11D-\uC137\uC139-\uC153\uC155-\uC16F\uC171-\uC18B\uC18D-\uC1A7\uC1A9-\uC1C3\uC1C5-\uC1DF\uC1E1-\uC1FB\uC1FD-\uC217\uC219-\uC233\uC235-\uC24F\uC251-\uC26B\uC26D-\uC287\uC289-\uC2A3\uC2A5-\uC2BF\uC2C1-\uC2DB\uC2DD-\uC2F7\uC2F9-\uC313\uC315-\uC32F\uC331-\uC34B\uC34D-\uC367\uC369-\uC383\uC385-\uC39F\uC3A1-\uC3BB\uC3BD-\uC3D7\uC3D9-\uC3F3\uC3F5-\uC40F\uC411-\uC42B\uC42D-\uC447\uC449-\uC463\uC465-\uC47F\uC481-\uC49B\uC49D-\uC4B7\uC4B9-\uC4D3\uC4D5-\uC4EF\uC4F1-\uC50B\uC50D-\uC527\uC529-\uC543\uC545-\uC55F\uC561-\uC57B\uC57D-\uC597\uC599-\uC5B3\uC5B5-\uC5CF\uC5D1-\uC5EB\uC5ED-\uC607\uC609-\uC623\uC625-\uC63F\uC641-\uC65B\uC65D-\uC677\uC679-\uC693\uC695-\uC6AF\uC6B1-\uC6CB\uC6CD-\uC6E7\uC6E9-\uC703\uC705-\uC71F\uC721-\uC73B\uC73D-\uC757\uC759-\uC773\uC775-\uC78F\uC791-\uC7AB\uC7AD-\uC7C7\uC7C9-\uC7E3\uC7E5-\uC7FF\uC801-\uC81B\uC81D-\uC837\uC839-\uC853\uC855-\uC86F\uC871-\uC88B\uC88D-\uC8A7\uC8A9-\uC8C3\uC8C5-\uC8DF\uC8E1-\uC8FB\uC8FD-\uC917\uC919-\uC933\uC935-\uC94F\uC951-\uC96B\uC96D-\uC987\uC989-\uC9A3\uC9A5-\uC9BF\uC9C1-\uC9DB\uC9DD-\uC9F7\uC9F9-\uCA13\uCA15-\uCA2F\uCA31-\uCA4B\uCA4D-\uCA67\uCA69-\uCA83\uCA85-\uCA9F\uCAA1-\uCABB\uCABD-\uCAD7\uCAD9-\uCAF3\uCAF5-\uCB0F\uCB11-\uCB2B\uCB2D-\uCB47\uCB49-\uCB63\uCB65-\uCB7F\uCB81-\uCB9B\uCB9D-\uCBB7\uCBB9-\uCBD3\uCBD5-\uCBEF\uCBF1-\uCC0B\uCC0D-\uCC27\uCC29-\uCC43\uCC45-\uCC5F\uCC61-\uCC7B\uCC7D-\uCC97\uCC99-\uCCB3\uCCB5-\uCCCF\uCCD1-\uCCEB\uCCED-\uCD07\uCD09-\uCD23\uCD25-\uCD3F\uCD41-\uCD5B\uCD5D-\uCD77\uCD79-\uCD93\uCD95-\uCDAF\uCDB1-\uCDCB\uCDCD-\uCDE7\uCDE9-\uCE03\uCE05-\uCE1F\uCE21-\uCE3B\uCE3D-\uCE57\uCE59-\uCE73\uCE75-\uCE8F\uCE91-\uCEAB\uCEAD-\uCEC7\uCEC9-\uCEE3\uCEE5-\uCEFF\uCF01-\uCF1B\uCF1D-\uCF37\uCF39-\uCF53\uCF55-\uCF6F\uCF71-\uCF8B\uCF8D-\uCFA7\uCFA9-\uCFC3\uCFC5-\uCFDF\uCFE1-\uCFFB\uCFFD-\uD017\uD019-\uD033\uD035-\uD04F\uD051-\uD06B\uD06D-\uD087\uD089-\uD0A3\uD0A5-\uD0BF\uD0C1-\uD0DB\uD0DD-\uD0F7\uD0F9-\uD113\uD115-\uD12F\uD131-\uD14B\uD14D-\uD167\uD169-\uD183\uD185-\uD19F\uD1A1-\uD1BB\uD1BD-\uD1D7\uD1D9-\uD1F3\uD1F5-\uD20F\uD211-\uD22B\uD22D-\uD247\uD249-\uD263\uD265-\uD27F\uD281-\uD29B\uD29D-\uD2B7\uD2B9-\uD2D3\uD2D5-\uD2EF\uD2F1-\uD30B\uD30D-\uD327\uD329-\uD343\uD345-\uD35F\uD361-\uD37B\uD37D-\uD397\uD399-\uD3B3\uD3B5-\uD3CF\uD3D1-\uD3EB\uD3ED-\uD407\uD409-\uD423\uD425-\uD43F\uD441-\uD45B\uD45D-\uD477\uD479-\uD493\uD495-\uD4AF\uD4B1-\uD4CB\uD4CD-\uD4E7\uD4E9-\uD503\uD505-\uD51F\uD521-\uD53B\uD53D-\uD557\uD559-\uD573\uD575-\uD58F\uD591-\uD5AB\uD5AD-\uD5C7\uD5C9-\uD5E3\uD5E5-\uD5FF\uD601-\uD61B\uD61D-\uD637\uD639-\uD653\uD655-\uD66F\uD671-\uD68B\uD68D-\uD6A7\uD6A9-\uD6C3\uD6C5-\uD6DF\uD6E1-\uD6FB\uD6FD-\uD717\uD719-\uD733\uD735-\uD74F\uD751-\uD76B\uD76D-\uD787\uD789-\uD7A3]$/;
var reExtPict = /^(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])$/;
var getCodepointType = function getCodepointType(_char4, code) {
  var type = CodepointType.Any;
  if (_char4.search(reExtend) !== -1) {
    type |= CodepointType.Extend;
  }
  if (code === 0x200d) {
    type |= CodepointType.ZWJ;
  }
  if (code >= 0x1f1e6 && code <= 0x1f1ff) {
    type |= CodepointType.RI;
  }
  if (_char4.search(rePrepend) !== -1) {
    type |= CodepointType.Prepend;
  }
  if (_char4.search(reSpacingMark) !== -1) {
    type |= CodepointType.SpacingMark;
  }
  if (_char4.search(reL) !== -1) {
    type |= CodepointType.L;
  }
  if (_char4.search(reV) !== -1) {
    type |= CodepointType.V;
  }
  if (_char4.search(reT) !== -1) {
    type |= CodepointType.T;
  }
  if (_char4.search(reLV) !== -1) {
    type |= CodepointType.LV;
  }
  if (_char4.search(reLVT) !== -1) {
    type |= CodepointType.LVT;
  }
  if (_char4.search(reExtPict) !== -1) {
    type |= CodepointType.ExtPict;
  }
  return type;
};
function intersects(x, y) {
  return (x & y) !== 0;
}
var NonBoundaryPairs = [
// GB6
[CodepointType.L, CodepointType.L | CodepointType.V | CodepointType.LV | CodepointType.LVT],
// GB7
[CodepointType.LV | CodepointType.V, CodepointType.V | CodepointType.T],
// GB8
[CodepointType.LVT | CodepointType.T, CodepointType.T],
// GB9
[CodepointType.Any, CodepointType.Extend | CodepointType.ZWJ],
// GB9a
[CodepointType.Any, CodepointType.SpacingMark],
// GB9b
[CodepointType.Prepend, CodepointType.Any],
// GB11
[CodepointType.ZWJ, CodepointType.ExtPict],
// GB12 and GB13
[CodepointType.RI, CodepointType.RI]];
function isBoundaryPair(left, right) {
  return NonBoundaryPairs.findIndex(function (r) {
    return intersects(left, r[0]) && intersects(right, r[1]);
  }) === -1;
}
var endingEmojiZWJ = /(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDEFD-\uDEFF\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDE41\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4\uDF00\uDF01\uDF36-\uDF3A\uDF40\uDF42]|\uD80D[\uDC40\uDC47-\uDC55]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC8F\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD839[\uDCEC-\uDCEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])*\u200D$/;
var endsWithEmojiZWJ = function endsWithEmojiZWJ(str) {
  return str.search(endingEmojiZWJ) !== -1;
};
var endingRIs = /(?:\uD83C[\uDDE6-\uDDFF])+$/g;
var endsWithOddNumberOfRIs = function endsWithOddNumberOfRIs(str) {
  var match = str.match(endingRIs);
  if (match === null) {
    return false;
  } else {
    // A RI is represented by a surrogate pair.
    var numRIs = match[0].length / 2;
    return numRIs % 2 === 1;
  }
};

// eslint-disable-next-line no-redeclare
var TextTransforms = {
  "delete": function _delete(editor, options) {
    editor["delete"](options);
  },
  insertFragment: function insertFragment(editor, fragment, options) {
    editor.insertFragment(fragment, options);
  },
  insertText: function insertText(editor, text) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    Editor.withoutNormalizing(editor, function () {
      var _options$voids = options.voids,
        voids = _options$voids === void 0 ? false : _options$voids;
      var _options$at = options.at,
        at = _options$at === void 0 ? getDefaultInsertLocation(editor) : _options$at;
      if (Path.isPath(at)) {
        at = Editor.range(editor, at);
      }
      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor;
        } else {
          var end = Range.end(at);
          if (!voids && Editor["void"](editor, {
            at: end
          })) {
            return;
          }
          var start = Range.start(at);
          var startRef = Editor.pointRef(editor, start);
          var endRef = Editor.pointRef(editor, end);
          Transforms["delete"](editor, {
            at: at,
            voids: voids
          });
          var startPoint = startRef.unref();
          var endPoint = endRef.unref();
          at = startPoint || endPoint;
          Transforms.setSelection(editor, {
            anchor: at,
            focus: at
          });
        }
      }
      if (!voids && Editor["void"](editor, {
        at: at
      }) || Editor.elementReadOnly(editor, {
        at: at
      })) {
        return;
      }
      var _at = at,
        path = _at.path,
        offset = _at.offset;
      if (text.length > 0) editor.apply({
        type: 'insert_text',
        path: path,
        offset: offset,
        text: text
      });
    });
  }
};

function ownKeys$9(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$9(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$9(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$9(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Transforms = _objectSpread$9(_objectSpread$9(_objectSpread$9(_objectSpread$9({}, GeneralTransforms), NodeTransforms), SelectionTransforms), TextTransforms);

function _createForOfIteratorHelper$h(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$h(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$h(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$h(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$h(o, minLen); }
function _arrayLikeToArray$h(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var apply = function apply(editor, op) {
  var _iterator = _createForOfIteratorHelper$h(Editor.pathRefs(editor)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var ref = _step.value;
      PathRef.transform(ref, op);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var _iterator2 = _createForOfIteratorHelper$h(Editor.pointRefs(editor)),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _ref = _step2.value;
      PointRef.transform(_ref, op);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var _iterator3 = _createForOfIteratorHelper$h(Editor.rangeRefs(editor)),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _ref2 = _step3.value;
      RangeRef.transform(_ref2, op);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var oldDirtyPaths = DIRTY_PATHS.get(editor) || [];
  var oldDirtyPathKeys = DIRTY_PATH_KEYS.get(editor) || new Set();
  var dirtyPaths;
  var dirtyPathKeys;
  var add = function add(path) {
    if (path) {
      var key = path.join(',');
      if (!dirtyPathKeys.has(key)) {
        dirtyPathKeys.add(key);
        dirtyPaths.push(path);
      }
    }
  };
  if (Path.operationCanTransformPath(op)) {
    dirtyPaths = [];
    dirtyPathKeys = new Set();
    var _iterator4 = _createForOfIteratorHelper$h(oldDirtyPaths),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var path = _step4.value;
        var newPath = Path.transform(path, op);
        add(newPath);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  } else {
    dirtyPaths = oldDirtyPaths;
    dirtyPathKeys = oldDirtyPathKeys;
  }
  var newDirtyPaths = editor.getDirtyPaths(op);
  var _iterator5 = _createForOfIteratorHelper$h(newDirtyPaths),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var _path = _step5.value;
      add(_path);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  DIRTY_PATHS.set(editor, dirtyPaths);
  DIRTY_PATH_KEYS.set(editor, dirtyPathKeys);
  Transforms.transform(editor, op);
  editor.operations.push(op);
  Editor.normalize(editor, {
    operation: op
  });
  // Clear any formats applied to the cursor if the selection changes.
  if (op.type === 'set_selection') {
    editor.marks = null;
  }
  if (!FLUSHING.get(editor)) {
    FLUSHING.set(editor, true);
    Promise.resolve().then(function () {
      FLUSHING.set(editor, false);
      editor.onChange({
        operation: op
      });
      editor.operations = [];
    });
  }
};

function _createForOfIteratorHelper$g(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$g(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$g(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$g(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$g(o, minLen); }
function _arrayLikeToArray$g(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Get the "dirty" paths generated from an operation.
 */
var getDirtyPaths = function getDirtyPaths(editor, op) {
  switch (op.type) {
    case 'insert_text':
    case 'remove_text':
    case 'set_node':
      {
        var path = op.path;
        return Path.levels(path);
      }
    case 'insert_node':
      {
        var node = op.node,
          _path = op.path;
        var levels = Path.levels(_path);
        var descendants = Text.isText(node) ? [] : Array.from(Node.nodes(node), function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            p = _ref2[1];
          return _path.concat(p);
        });
        return [].concat(_toConsumableArray(levels), _toConsumableArray(descendants));
      }
    case 'merge_node':
      {
        var _path2 = op.path;
        var ancestors = Path.ancestors(_path2);
        var previousPath = Path.previous(_path2);
        return [].concat(_toConsumableArray(ancestors), [previousPath]);
      }
    case 'move_node':
      {
        var _path3 = op.path,
          newPath = op.newPath;
        if (Path.equals(_path3, newPath)) {
          return [];
        }
        var oldAncestors = [];
        var newAncestors = [];
        var _iterator = _createForOfIteratorHelper$g(Path.ancestors(_path3)),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var ancestor = _step.value;
            var p = Path.transform(ancestor, op);
            oldAncestors.push(p);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        var _iterator2 = _createForOfIteratorHelper$g(Path.ancestors(newPath)),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _ancestor = _step2.value;
            var _p = Path.transform(_ancestor, op);
            newAncestors.push(_p);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var newParent = newAncestors[newAncestors.length - 1];
        var newIndex = newPath[newPath.length - 1];
        var resultPath = newParent.concat(newIndex);
        return [].concat(oldAncestors, newAncestors, [resultPath]);
      }
    case 'remove_node':
      {
        var _path4 = op.path;
        var _ancestors = Path.ancestors(_path4);
        return _toConsumableArray(_ancestors);
      }
    case 'split_node':
      {
        var _path5 = op.path;
        var _levels = Path.levels(_path5);
        var nextPath = Path.next(_path5);
        return [].concat(_toConsumableArray(_levels), [nextPath]);
      }
    default:
      {
        return [];
      }
  }
};

var getFragment = function getFragment(editor) {
  var selection = editor.selection;
  if (selection) {
    return Node.fragment(editor, selection);
  }
  return [];
};

var normalizeNode = function normalizeNode(editor, entry) {
  var _entry = _slicedToArray(entry, 2),
    node = _entry[0],
    path = _entry[1];
  // There are no core normalizations for text nodes.
  if (Text.isText(node)) {
    return;
  }
  // Ensure that block and inline nodes have at least one text child.
  if (Element.isElement(node) && node.children.length === 0) {
    var child = {
      text: ''
    };
    Transforms.insertNodes(editor, child, {
      at: path.concat(0),
      voids: true
    });
    return;
  }
  // Determine whether the node should have block or inline children.
  var shouldHaveInlines = Editor.isEditor(node) ? false : Element.isElement(node) && (editor.isInline(node) || node.children.length === 0 || Text.isText(node.children[0]) || editor.isInline(node.children[0]));
  // Since we'll be applying operations while iterating, keep track of an
  // index that accounts for any added/removed nodes.
  var n = 0;
  for (var i = 0; i < node.children.length; i++, n++) {
    var currentNode = Node.get(editor, path);
    if (Text.isText(currentNode)) continue;
    var _child = currentNode.children[n];
    var prev = currentNode.children[n - 1];
    var isLast = i === node.children.length - 1;
    var isInlineOrText = Text.isText(_child) || Element.isElement(_child) && editor.isInline(_child);
    // Only allow block nodes in the top-level children and parent blocks
    // that only contain block nodes. Similarly, only allow inline nodes in
    // other inline nodes, or parent blocks that only contain inlines and
    // text.
    if (isInlineOrText !== shouldHaveInlines) {
      Transforms.removeNodes(editor, {
        at: path.concat(n),
        voids: true
      });
      n--;
    } else if (Element.isElement(_child)) {
      // Ensure that inline nodes are surrounded by text nodes.
      if (editor.isInline(_child)) {
        if (prev == null || !Text.isText(prev)) {
          var newChild = {
            text: ''
          };
          Transforms.insertNodes(editor, newChild, {
            at: path.concat(n),
            voids: true
          });
          n++;
        } else if (isLast) {
          var _newChild = {
            text: ''
          };
          Transforms.insertNodes(editor, _newChild, {
            at: path.concat(n + 1),
            voids: true
          });
          n++;
        }
      }
    } else {
      // Merge adjacent text nodes that are empty or match.
      if (prev != null && Text.isText(prev)) {
        if (Text.equals(_child, prev, {
          loose: true
        })) {
          Transforms.mergeNodes(editor, {
            at: path.concat(n),
            voids: true
          });
          n--;
        } else if (prev.text === '') {
          Transforms.removeNodes(editor, {
            at: path.concat(n - 1),
            voids: true
          });
          n--;
        } else if (_child.text === '') {
          Transforms.removeNodes(editor, {
            at: path.concat(n),
            voids: true
          });
          n--;
        }
      }
    }
  }
};

var shouldNormalize = function shouldNormalize(editor, _ref) {
  var iteration = _ref.iteration,
    initialDirtyPathsLength = _ref.initialDirtyPathsLength;
  var maxIterations = initialDirtyPathsLength * 42; // HACK: better way?
  if (iteration > maxIterations) {
    throw new Error("Could not completely normalize the editor after ".concat(maxIterations, " iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state."));
  }
  return true;
};

function _createForOfIteratorHelper$f(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$f(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$f(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$f(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$f(o, minLen); }
function _arrayLikeToArray$f(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var above = function above(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$voids = options.voids,
    voids = _options$voids === void 0 ? false : _options$voids,
    _options$mode = options.mode,
    mode = _options$mode === void 0 ? 'lowest' : _options$mode,
    _options$at = options.at,
    at = _options$at === void 0 ? editor.selection : _options$at,
    match = options.match;
  if (!at) {
    return;
  }
  var path = Editor.path(editor, at);
  var reverse = mode === 'lowest';
  var _iterator = _createForOfIteratorHelper$f(Editor.levels(editor, {
      at: path,
      voids: voids,
      match: match,
      reverse: reverse
    })),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        n = _step$value[0],
        p = _step$value[1];
      if (Text.isText(n)) continue;
      if (Range.isRange(at)) {
        if (Path.isAncestor(p, at.anchor.path) && Path.isAncestor(p, at.focus.path)) {
          return [n, p];
        }
      } else {
        if (!Path.equals(path, p)) {
          return [n, p];
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

function ownKeys$8(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$8(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$8(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$8(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var addMark = function addMark(editor, key, value) {
  var selection = editor.selection;
  if (selection) {
    var match = function match(node, path) {
      if (!Text.isText(node)) {
        return false; // marks can only be applied to text
      }

      var _Editor$parent = Editor.parent(editor, path),
        _Editor$parent2 = _slicedToArray(_Editor$parent, 2),
        parentNode = _Editor$parent2[0];
        _Editor$parent2[1];
      return !editor.isVoid(parentNode) || editor.markableVoid(parentNode);
    };
    var expandedSelection = Range.isExpanded(selection);
    var markAcceptingVoidSelected = false;
    if (!expandedSelection) {
      var _Editor$node = Editor.node(editor, selection),
        _Editor$node2 = _slicedToArray(_Editor$node, 2),
        selectedNode = _Editor$node2[0],
        selectedPath = _Editor$node2[1];
      if (selectedNode && match(selectedNode, selectedPath)) {
        var _Editor$parent3 = Editor.parent(editor, selectedPath),
          _Editor$parent4 = _slicedToArray(_Editor$parent3, 1),
          parentNode = _Editor$parent4[0];
        markAcceptingVoidSelected = parentNode && editor.markableVoid(parentNode);
      }
    }
    if (expandedSelection || markAcceptingVoidSelected) {
      Transforms.setNodes(editor, _defineProperty({}, key, value), {
        match: match,
        split: true,
        voids: true
      });
    } else {
      var marks = _objectSpread$8(_objectSpread$8({}, Editor.marks(editor) || {}), {}, _defineProperty({}, key, value));
      editor.marks = marks;
      if (!FLUSHING.get(editor)) {
        editor.onChange();
      }
    }
  }
};

function ownKeys$7(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$7(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$7(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$7(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper$e(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$e(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$e(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$e(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$e(o, minLen); }
function _arrayLikeToArray$e(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var after = function after(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var anchor = Editor.point(editor, at, {
    edge: 'end'
  });
  var focus = Editor.end(editor, []);
  var range = {
    anchor: anchor,
    focus: focus
  };
  var _options$distance = options.distance,
    distance = _options$distance === void 0 ? 1 : _options$distance;
  var d = 0;
  var target;
  var _iterator = _createForOfIteratorHelper$e(Editor.positions(editor, _objectSpread$7(_objectSpread$7({}, options), {}, {
      at: range
    }))),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var p = _step.value;
      if (d > distance) {
        break;
      }
      if (d !== 0) {
        target = p;
      }
      d++;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return target;
};

function ownKeys$6(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$6(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$6(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper$d(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$d(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$d(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$d(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$d(o, minLen); }
function _arrayLikeToArray$d(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var before = function before(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var anchor = Editor.start(editor, []);
  var focus = Editor.point(editor, at, {
    edge: 'start'
  });
  var range = {
    anchor: anchor,
    focus: focus
  };
  var _options$distance = options.distance,
    distance = _options$distance === void 0 ? 1 : _options$distance;
  var d = 0;
  var target;
  var _iterator = _createForOfIteratorHelper$d(Editor.positions(editor, _objectSpread$6(_objectSpread$6({}, options), {}, {
      at: range,
      reverse: true
    }))),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var p = _step.value;
      if (d > distance) {
        break;
      }
      if (d !== 0) {
        target = p;
      }
      d++;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return target;
};

var deleteBackward = function deleteBackward(editor, unit) {
  var selection = editor.selection;
  if (selection && Range.isCollapsed(selection)) {
    Transforms["delete"](editor, {
      unit: unit,
      reverse: true
    });
  }
};

var deleteForward = function deleteForward(editor, unit) {
  var selection = editor.selection;
  if (selection && Range.isCollapsed(selection)) {
    Transforms["delete"](editor, {
      unit: unit
    });
  }
};

var deleteFragment = function deleteFragment(editor) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$direction = _ref.direction,
    direction = _ref$direction === void 0 ? 'forward' : _ref$direction;
  var selection = editor.selection;
  if (selection && Range.isExpanded(selection)) {
    Transforms["delete"](editor, {
      reverse: direction === 'backward'
    });
  }
};

var edges = function edges(editor, at) {
  return [Editor.start(editor, at), Editor.end(editor, at)];
};

function ownKeys$5(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$5(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$5(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var elementReadOnly = function elementReadOnly(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Editor.above(editor, _objectSpread$5(_objectSpread$5({}, options), {}, {
    match: function match(n) {
      return Element.isElement(n) && Editor.isElementReadOnly(editor, n);
    }
  }));
};

var end = function end(editor, at) {
  return Editor.point(editor, at, {
    edge: 'end'
  });
};

var first = function first(editor, at) {
  var path = Editor.path(editor, at, {
    edge: 'start'
  });
  return Editor.node(editor, path);
};

var fragment = function fragment(editor, at) {
  var range = Editor.range(editor, at);
  return Node.fragment(editor, range);
};

function ownKeys$4(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$4(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$4(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var getVoid = function getVoid(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Editor.above(editor, _objectSpread$4(_objectSpread$4({}, options), {}, {
    match: function match(n) {
      return Element.isElement(n) && Editor.isVoid(editor, n);
    }
  }));
};

var hasBlocks = function hasBlocks(editor, element) {
  return element.children.some(function (n) {
    return Element.isElement(n) && Editor.isBlock(editor, n);
  });
};

var hasInlines = function hasInlines(editor, element) {
  return element.children.some(function (n) {
    return Text.isText(n) || Editor.isInline(editor, n);
  });
};

var hasPath = function hasPath(editor, path) {
  return Node.has(editor, path);
};

var hasTexts = function hasTexts(editor, element) {
  return element.children.every(function (n) {
    return Text.isText(n);
  });
};

var insertBreak = function insertBreak(editor) {
  Transforms.splitNodes(editor, {
    always: true
  });
};

var insertNode = function insertNode(editor, node, options) {
  Transforms.insertNodes(editor, node, options);
};

var insertSoftBreak = function insertSoftBreak(editor) {
  Transforms.splitNodes(editor, {
    always: true
  });
};

function ownKeys$3(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$3(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var insertText = function insertText(editor, text) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var selection = editor.selection,
    marks = editor.marks;
  if (selection) {
    if (marks) {
      var node = _objectSpread$3({
        text: text
      }, marks);
      Transforms.insertNodes(editor, node, {
        at: options.at,
        voids: options.voids
      });
    } else {
      Transforms.insertText(editor, text, options);
    }
    editor.marks = null;
  }
};

var isBlock = function isBlock(editor, value) {
  return !editor.isInline(value);
};

var isEdge = function isEdge(editor, point, at) {
  return Editor.isStart(editor, point, at) || Editor.isEnd(editor, point, at);
};

var isEmpty = function isEmpty(editor, element) {
  var children = element.children;
  var _children = _slicedToArray(children, 1),
    first = _children[0];
  return children.length === 0 || children.length === 1 && Text.isText(first) && first.text === '' && !editor.isVoid(element);
};

var isEnd = function isEnd(editor, point, at) {
  var end = Editor.end(editor, at);
  return Point.equals(point, end);
};

var isNormalizing = function isNormalizing(editor) {
  var isNormalizing = NORMALIZING.get(editor);
  return isNormalizing === undefined ? true : isNormalizing;
};

var isStart = function isStart(editor, point, at) {
  // PERF: If the offset isn't `0` we know it's not the start.
  if (point.offset !== 0) {
    return false;
  }
  var start = Editor.start(editor, at);
  return Point.equals(point, start);
};

var last = function last(editor, at) {
  var path = Editor.path(editor, at, {
    edge: 'end'
  });
  return Editor.node(editor, path);
};

var leaf = function leaf(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var path = Editor.path(editor, at, options);
  var node = Node.leaf(editor, path);
  return [node, path];
};

function _createForOfIteratorHelper$c(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$c(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$c(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$c(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$c(o, minLen); }
function _arrayLikeToArray$c(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function levels(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function* () {
    var _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      _options$reverse = options.reverse,
      reverse = _options$reverse === void 0 ? false : _options$reverse,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    var match = options.match;
    if (match == null) {
      match = function match() {
        return true;
      };
    }
    if (!at) {
      return;
    }
    var levels = [];
    var path = Editor.path(editor, at);
    var _iterator = _createForOfIteratorHelper$c(Node.levels(editor, path)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          n = _step$value[0],
          p = _step$value[1];
        if (!match(n, p)) {
          continue;
        }
        levels.push([n, p]);
        if (!voids && Element.isElement(n) && Editor.isVoid(editor, n)) {
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (reverse) {
      levels.reverse();
    }
    yield* levels;
  }();
}

var _excluded$1 = ["text"],
  _excluded2$1 = ["text"];
var marks = function marks(editor) {
  var marks = editor.marks,
    selection = editor.selection;
  if (!selection) {
    return null;
  }
  var anchor = selection.anchor,
    focus = selection.focus;
  if (marks) {
    return marks;
  }
  if (Range.isExpanded(selection)) {
    /**
     * COMPAT: Make sure hanging ranges (caused by double clicking in Firefox)
     * do not adversely affect the returned marks.
     */
    var isEnd = Editor.isEnd(editor, anchor, anchor.path);
    if (isEnd) {
      var after = Editor.after(editor, anchor);
      if (after) {
        anchor = after;
      }
    }
    var _Editor$nodes = Editor.nodes(editor, {
        match: Text.isText,
        at: {
          anchor: anchor,
          focus: focus
        }
      }),
      _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
      match = _Editor$nodes2[0];
    if (match) {
      var _match = _slicedToArray(match, 1),
        _node = _match[0];
      _node.text;
        var _rest = _objectWithoutProperties(_node, _excluded$1);
      return _rest;
    } else {
      return {};
    }
  }
  var _anchor = anchor,
    path = _anchor.path;
  var _Editor$leaf = Editor.leaf(editor, path),
    _Editor$leaf2 = _slicedToArray(_Editor$leaf, 1),
    node = _Editor$leaf2[0];
  if (anchor.offset === 0) {
    var prev = Editor.previous(editor, {
      at: path,
      match: Text.isText
    });
    var markedVoid = Editor.above(editor, {
      match: function match(n) {
        return Element.isElement(n) && Editor.isVoid(editor, n) && editor.markableVoid(n);
      }
    });
    if (!markedVoid) {
      var block = Editor.above(editor, {
        match: function match(n) {
          return Element.isElement(n) && Editor.isBlock(editor, n);
        }
      });
      if (prev && block) {
        var _prev = _slicedToArray(prev, 2),
          prevNode = _prev[0],
          prevPath = _prev[1];
        var _block = _slicedToArray(block, 2),
          blockPath = _block[1];
        if (Path.isAncestor(blockPath, prevPath)) {
          node = prevNode;
        }
      }
    }
  }
  var _node2 = node;
    _node2.text;
    var rest = _objectWithoutProperties(_node2, _excluded2$1);
  return rest;
};

var next = function next(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$mode = options.mode,
    mode = _options$mode === void 0 ? 'lowest' : _options$mode,
    _options$voids = options.voids,
    voids = _options$voids === void 0 ? false : _options$voids;
  var match = options.match,
    _options$at = options.at,
    at = _options$at === void 0 ? editor.selection : _options$at;
  if (!at) {
    return;
  }
  var pointAfterLocation = Editor.after(editor, at, {
    voids: voids
  });
  if (!pointAfterLocation) return;
  var _Editor$last = Editor.last(editor, []),
    _Editor$last2 = _slicedToArray(_Editor$last, 2),
    to = _Editor$last2[1];
  var span = [pointAfterLocation.path, to];
  if (Path.isPath(at) && at.length === 0) {
    throw new Error("Cannot get the next node from the root node!");
  }
  if (match == null) {
    if (Path.isPath(at)) {
      var _Editor$parent = Editor.parent(editor, at),
        _Editor$parent2 = _slicedToArray(_Editor$parent, 1),
        parent = _Editor$parent2[0];
      match = function match(n) {
        return parent.children.includes(n);
      };
    } else {
      match = function match() {
        return true;
      };
    }
  }
  var _Editor$nodes = Editor.nodes(editor, {
      at: span,
      match: match,
      mode: mode,
      voids: voids
    }),
    _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
    next = _Editor$nodes2[0];
  return next;
};

var node = function node(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var path = Editor.path(editor, at, options);
  var node = Node.get(editor, path);
  return [node, path];
};

function _createForOfIteratorHelper$b(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$b(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$b(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$b(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$b(o, minLen); }
function _arrayLikeToArray$b(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function nodes(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function* () {
    var _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'all' : _options$mode,
      _options$universal = options.universal,
      universal = _options$universal === void 0 ? false : _options$universal,
      _options$reverse = options.reverse,
      reverse = _options$reverse === void 0 ? false : _options$reverse,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids,
      _options$ignoreNonSel = options.ignoreNonSelectable,
      ignoreNonSelectable = _options$ignoreNonSel === void 0 ? false : _options$ignoreNonSel;
    var match = options.match;
    if (!match) {
      match = function match() {
        return true;
      };
    }
    if (!at) {
      return;
    }
    var from;
    var to;
    if (Span.isSpan(at)) {
      from = at[0];
      to = at[1];
    } else {
      var first = Editor.path(editor, at, {
        edge: 'start'
      });
      var last = Editor.path(editor, at, {
        edge: 'end'
      });
      from = reverse ? last : first;
      to = reverse ? first : last;
    }
    var nodeEntries = Node.nodes(editor, {
      reverse: reverse,
      from: from,
      to: to,
      pass: function pass(_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
          node = _ref2[0];
        if (!Element.isElement(node)) return false;
        if (!voids && (Editor.isVoid(editor, node) || Editor.isElementReadOnly(editor, node))) return true;
        if (ignoreNonSelectable && !Editor.isSelectable(editor, node)) return true;
        return false;
      }
    });
    var matches = [];
    var hit;
    var _iterator = _createForOfIteratorHelper$b(nodeEntries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          node = _step$value[0],
          path = _step$value[1];
        if (ignoreNonSelectable && Element.isElement(node) && !Editor.isSelectable(editor, node)) {
          continue;
        }
        var isLower = hit && Path.compare(path, hit[1]) === 0;
        // In highest mode any node lower than the last hit is not a match.
        if (mode === 'highest' && isLower) {
          continue;
        }
        if (!match(node, path)) {
          // If we've arrived at a leaf text node that is not lower than the last
          // hit, then we've found a branch that doesn't include a match, which
          // means the match is not universal.
          if (universal && !isLower && Text.isText(node)) {
            return;
          } else {
            continue;
          }
        }
        // If there's a match and it's lower than the last, update the hit.
        if (mode === 'lowest' && isLower) {
          hit = [node, path];
          continue;
        }
        // In lowest mode we emit the last hit, once it's guaranteed lowest.
        var emit = mode === 'lowest' ? hit : [node, path];
        if (emit) {
          if (universal) {
            matches.push(emit);
          } else {
            yield emit;
          }
        }
        hit = [node, path];
      }
      // Since lowest is always emitting one behind, catch up at the end.
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (mode === 'lowest' && hit) {
      if (universal) {
        matches.push(hit);
      } else {
        yield hit;
      }
    }
    // Universal defers to ensure that the match occurs in every branch, so we
    // yield all of the matches after iterating.
    if (universal) {
      yield* matches;
    }
  }();
}

function _createForOfIteratorHelper$a(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$a(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$a(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$a(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$a(o, minLen); }
function _arrayLikeToArray$a(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var normalize = function normalize(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$force = options.force,
    force = _options$force === void 0 ? false : _options$force,
    operation = options.operation;
  var getDirtyPaths = function getDirtyPaths(editor) {
    return DIRTY_PATHS.get(editor) || [];
  };
  var getDirtyPathKeys = function getDirtyPathKeys(editor) {
    return DIRTY_PATH_KEYS.get(editor) || new Set();
  };
  var popDirtyPath = function popDirtyPath(editor) {
    var path = getDirtyPaths(editor).pop();
    var key = path.join(',');
    getDirtyPathKeys(editor)["delete"](key);
    return path;
  };
  if (!Editor.isNormalizing(editor)) {
    return;
  }
  if (force) {
    var allPaths = Array.from(Node.nodes(editor), function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        p = _ref2[1];
      return p;
    });
    var allPathKeys = new Set(allPaths.map(function (p) {
      return p.join(',');
    }));
    DIRTY_PATHS.set(editor, allPaths);
    DIRTY_PATH_KEYS.set(editor, allPathKeys);
  }
  if (getDirtyPaths(editor).length === 0) {
    return;
  }
  Editor.withoutNormalizing(editor, function () {
    /*
      Fix dirty elements with no children.
      editor.normalizeNode() does fix this, but some normalization fixes also require it to work.
      Running an initial pass avoids the catch-22 race condition.
    */
    var _iterator = _createForOfIteratorHelper$a(getDirtyPaths(editor)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _dirtyPath = _step.value;
        if (Node.has(editor, _dirtyPath)) {
          var _entry = Editor.node(editor, _dirtyPath);
          var _entry2 = _slicedToArray(_entry, 2),
            node = _entry2[0],
            _ = _entry2[1];
          /*
            The default normalizer inserts an empty text node in this scenario, but it can be customised.
            So there is some risk here.
                     As long as the normalizer only inserts child nodes for this case it is safe to do in any order;
            by definition adding children to an empty node can't cause other paths to change.
          */
          if (Element.isElement(node) && node.children.length === 0) {
            editor.normalizeNode(_entry, {
              operation: operation
            });
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var dirtyPaths = getDirtyPaths(editor);
    var initialDirtyPathsLength = dirtyPaths.length;
    var iteration = 0;
    while (dirtyPaths.length !== 0) {
      if (!editor.shouldNormalize({
        dirtyPaths: dirtyPaths,
        iteration: iteration,
        initialDirtyPathsLength: initialDirtyPathsLength,
        operation: operation
      })) {
        return;
      }
      var dirtyPath = popDirtyPath(editor);
      // If the node doesn't exist in the tree, it does not need to be normalized.
      if (Node.has(editor, dirtyPath)) {
        var entry = Editor.node(editor, dirtyPath);
        editor.normalizeNode(entry, {
          operation: operation
        });
      }
      iteration++;
      dirtyPaths = getDirtyPaths(editor);
    }
  });
};

var parent = function parent(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var path = Editor.path(editor, at, options);
  var parentPath = Path.parent(path);
  var entry = Editor.node(editor, parentPath);
  return entry;
};

var pathRef = function pathRef(editor, path) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$affinity = options.affinity,
    affinity = _options$affinity === void 0 ? 'forward' : _options$affinity;
  var ref = {
    current: path,
    affinity: affinity,
    unref: function unref() {
      var current = ref.current;
      var pathRefs = Editor.pathRefs(editor);
      pathRefs["delete"](ref);
      ref.current = null;
      return current;
    }
  };
  var refs = Editor.pathRefs(editor);
  refs.add(ref);
  return ref;
};

var pathRefs = function pathRefs(editor) {
  var refs = PATH_REFS.get(editor);
  if (!refs) {
    refs = new Set();
    PATH_REFS.set(editor, refs);
  }
  return refs;
};

var path = function path(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var depth = options.depth,
    edge = options.edge;
  if (Path.isPath(at)) {
    if (edge === 'start') {
      var _Node$first = Node.first(editor, at),
        _Node$first2 = _slicedToArray(_Node$first, 2),
        firstPath = _Node$first2[1];
      at = firstPath;
    } else if (edge === 'end') {
      var _Node$last = Node.last(editor, at),
        _Node$last2 = _slicedToArray(_Node$last, 2),
        lastPath = _Node$last2[1];
      at = lastPath;
    }
  }
  if (Range.isRange(at)) {
    if (edge === 'start') {
      at = Range.start(at);
    } else if (edge === 'end') {
      at = Range.end(at);
    } else {
      at = Path.common(at.anchor.path, at.focus.path);
    }
  }
  if (Point.isPoint(at)) {
    at = at.path;
  }
  if (depth != null) {
    at = at.slice(0, depth);
  }
  return at;
};

var pointRef = function pointRef(editor, point) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$affinity = options.affinity,
    affinity = _options$affinity === void 0 ? 'forward' : _options$affinity;
  var ref = {
    current: point,
    affinity: affinity,
    unref: function unref() {
      var current = ref.current;
      var pointRefs = Editor.pointRefs(editor);
      pointRefs["delete"](ref);
      ref.current = null;
      return current;
    }
  };
  var refs = Editor.pointRefs(editor);
  refs.add(ref);
  return ref;
};

var pointRefs = function pointRefs(editor) {
  var refs = POINT_REFS.get(editor);
  if (!refs) {
    refs = new Set();
    POINT_REFS.set(editor, refs);
  }
  return refs;
};

var point = function point(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$edge = options.edge,
    edge = _options$edge === void 0 ? 'start' : _options$edge;
  if (Path.isPath(at)) {
    var path;
    if (edge === 'end') {
      var _Node$last = Node.last(editor, at),
        _Node$last2 = _slicedToArray(_Node$last, 2),
        lastPath = _Node$last2[1];
      path = lastPath;
    } else {
      var _Node$first = Node.first(editor, at),
        _Node$first2 = _slicedToArray(_Node$first, 2),
        firstPath = _Node$first2[1];
      path = firstPath;
    }
    var node = Node.get(editor, path);
    if (!Text.isText(node)) {
      throw new Error("Cannot get the ".concat(edge, " point in the node at path [").concat(at, "] because it has no ").concat(edge, " text node."));
    }
    return {
      path: path,
      offset: edge === 'end' ? node.text.length : 0
    };
  }
  if (Range.isRange(at)) {
    var _Range$edges = Range.edges(at),
      _Range$edges2 = _slicedToArray(_Range$edges, 2),
      start = _Range$edges2[0],
      end = _Range$edges2[1];
    return edge === 'start' ? start : end;
  }
  return at;
};

function _createForOfIteratorHelper$9(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$9(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$9(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$9(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$9(o, minLen); }
function _arrayLikeToArray$9(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function positions(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function* () {
    var _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      _options$unit = options.unit,
      unit = _options$unit === void 0 ? 'offset' : _options$unit,
      _options$reverse = options.reverse,
      reverse = _options$reverse === void 0 ? false : _options$reverse,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids,
      _options$ignoreNonSel = options.ignoreNonSelectable,
      ignoreNonSelectable = _options$ignoreNonSel === void 0 ? false : _options$ignoreNonSel;
    if (!at) {
      return;
    }
    /**
     * Algorithm notes:
     *
     * Each step `distance` is dynamic depending on the underlying text
     * and the `unit` specified.  Each step, e.g., a line or word, may
     * span multiple text nodes, so we iterate through the text both on
     * two levels in step-sync:
     *
     * `leafText` stores the text on a text leaf level, and is advanced
     * through using the counters `leafTextOffset` and `leafTextRemaining`.
     *
     * `blockText` stores the text on a block level, and is shortened
     * by `distance` every time it is advanced.
     *
     * We only maintain a window of one blockText and one leafText because
     * a block node always appears before all of its leaf nodes.
     */
    var range = Editor.range(editor, at);
    var _Range$edges = Range.edges(range),
      _Range$edges2 = _slicedToArray(_Range$edges, 2),
      start = _Range$edges2[0],
      end = _Range$edges2[1];
    var first = reverse ? end : start;
    var isNewBlock = false;
    var blockText = '';
    var distance = 0; // Distance for leafText to catch up to blockText.
    var leafTextRemaining = 0;
    var leafTextOffset = 0;
    // Iterate through all nodes in range, grabbing entire textual content
    // of block nodes in blockText, and text nodes in leafText.
    // Exploits the fact that nodes are sequenced in such a way that we first
    // encounter the block node, then all of its text nodes, so when iterating
    // through the blockText and leafText we just need to remember a window of
    // one block node and leaf node, respectively.
    var _iterator = _createForOfIteratorHelper$9(Editor.nodes(editor, {
        at: at,
        reverse: reverse,
        voids: voids,
        ignoreNonSelectable: ignoreNonSelectable
      })),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          node = _step$value[0],
          path = _step$value[1];
        /*
         * ELEMENT NODE - Yield position(s) for voids, collect blockText for blocks
         */
        if (Element.isElement(node)) {
          // Void nodes are a special case, so by default we will always
          // yield their first point. If the `voids` option is set to true,
          // then we will iterate over their content.
          if (!voids && (editor.isVoid(node) || editor.isElementReadOnly(node))) {
            yield Editor.start(editor, path);
            continue;
          }
          // Inline element nodes are ignored as they don't themselves
          // contribute to `blockText` or `leafText` - their parent and
          // children do.
          if (editor.isInline(node)) continue;
          // Block element node - set `blockText` to its text content.
          if (Editor.hasInlines(editor, node)) {
            // We always exhaust block nodes before encountering a new one:
            //   console.assert(blockText === '',
            //     `blockText='${blockText}' - `+
            //     `not exhausted before new block node`, path)
            // Ensure range considered is capped to `range`, in the
            // start/end edge cases where block extends beyond range.
            // Equivalent to this, but presumably more performant:
            //   blockRange = Editor.range(editor, ...Editor.edges(editor, path))
            //   blockRange = Range.intersection(range, blockRange) // intersect
            //   blockText = Editor.string(editor, blockRange, { voids })
            var e = Path.isAncestor(path, end.path) ? end : Editor.end(editor, path);
            var s = Path.isAncestor(path, start.path) ? start : Editor.start(editor, path);
            blockText = Editor.string(editor, {
              anchor: s,
              focus: e
            }, {
              voids: voids
            });
            isNewBlock = true;
          }
        }
        /*
         * TEXT LEAF NODE - Iterate through text content, yielding
         * positions every `distance` offset according to `unit`.
         */
        if (Text.isText(node)) {
          var isFirst = Path.equals(path, first.path);
          // Proof that we always exhaust text nodes before encountering a new one:
          //   console.assert(leafTextRemaining <= 0,
          //     `leafTextRemaining=${leafTextRemaining} - `+
          //     `not exhausted before new leaf text node`, path)
          // Reset `leafText` counters for new text node.
          if (isFirst) {
            leafTextRemaining = reverse ? first.offset : node.text.length - first.offset;
            leafTextOffset = first.offset; // Works for reverse too.
          } else {
            leafTextRemaining = node.text.length;
            leafTextOffset = reverse ? leafTextRemaining : 0;
          }
          // Yield position at the start of node (potentially).
          if (isFirst || isNewBlock || unit === 'offset') {
            yield {
              path: path,
              offset: leafTextOffset
            };
            isNewBlock = false;
          }
          // Yield positions every (dynamically calculated) `distance` offset.
          while (true) {
            // If `leafText` has caught up with `blockText` (distance=0),
            // and if blockText is exhausted, break to get another block node,
            // otherwise advance blockText forward by the new `distance`.
            if (distance === 0) {
              if (blockText === '') break;
              distance = calcDistance(blockText, unit, reverse);
              // Split the string at the previously found distance and use the
              // remaining string for the next iteration.
              blockText = splitByCharacterDistance(blockText, distance, reverse)[1];
            }
            // Advance `leafText` by the current `distance`.
            leafTextOffset = reverse ? leafTextOffset - distance : leafTextOffset + distance;
            leafTextRemaining = leafTextRemaining - distance;
            // If `leafText` is exhausted, break to get a new leaf node
            // and set distance to the overflow amount, so we'll (maybe)
            // catch up to blockText in the next leaf text node.
            if (leafTextRemaining < 0) {
              distance = -leafTextRemaining;
              break;
            }
            // Successfully walked `distance` offsets through `leafText`
            // to catch up with `blockText`, so we can reset `distance`
            // and yield this position in this node.
            distance = 0;
            yield {
              path: path,
              offset: leafTextOffset
            };
          }
        }
      }
      // Proof that upon completion, we've exahusted both leaf and block text:
      //   console.assert(leafTextRemaining <= 0, "leafText wasn't exhausted")
      //   console.assert(blockText === '', "blockText wasn't exhausted")
      // Helper:
      // Return the distance in offsets for a step of size `unit` on given string.
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    function calcDistance(text, unit, reverse) {
      if (unit === 'character') {
        return getCharacterDistance(text, reverse);
      } else if (unit === 'word') {
        return getWordDistance(text, reverse);
      } else if (unit === 'line' || unit === 'block') {
        return text.length;
      }
      return 1;
    }
  }();
}

var previous = function previous(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$mode = options.mode,
    mode = _options$mode === void 0 ? 'lowest' : _options$mode,
    _options$voids = options.voids,
    voids = _options$voids === void 0 ? false : _options$voids;
  var match = options.match,
    _options$at = options.at,
    at = _options$at === void 0 ? editor.selection : _options$at;
  if (!at) {
    return;
  }
  var pointBeforeLocation = Editor.before(editor, at, {
    voids: voids
  });
  if (!pointBeforeLocation) {
    return;
  }
  var _Editor$first = Editor.first(editor, []),
    _Editor$first2 = _slicedToArray(_Editor$first, 2),
    to = _Editor$first2[1];
  // The search location is from the start of the document to the path of
  // the point before the location passed in
  var span = [pointBeforeLocation.path, to];
  if (Path.isPath(at) && at.length === 0) {
    throw new Error("Cannot get the previous node from the root node!");
  }
  if (match == null) {
    if (Path.isPath(at)) {
      var _Editor$parent = Editor.parent(editor, at),
        _Editor$parent2 = _slicedToArray(_Editor$parent, 1),
        parent = _Editor$parent2[0];
      match = function match(n) {
        return parent.children.includes(n);
      };
    } else {
      match = function match() {
        return true;
      };
    }
  }
  var _Editor$nodes = Editor.nodes(editor, {
      reverse: true,
      at: span,
      match: match,
      mode: mode,
      voids: voids
    }),
    _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
    previous = _Editor$nodes2[0];
  return previous;
};

var rangeRef = function rangeRef(editor, range) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$affinity = options.affinity,
    affinity = _options$affinity === void 0 ? 'forward' : _options$affinity;
  var ref = {
    current: range,
    affinity: affinity,
    unref: function unref() {
      var current = ref.current;
      var rangeRefs = Editor.rangeRefs(editor);
      rangeRefs["delete"](ref);
      ref.current = null;
      return current;
    }
  };
  var refs = Editor.rangeRefs(editor);
  refs.add(ref);
  return ref;
};

var rangeRefs = function rangeRefs(editor) {
  var refs = RANGE_REFS.get(editor);
  if (!refs) {
    refs = new Set();
    RANGE_REFS.set(editor, refs);
  }
  return refs;
};

var range = function range(editor, at, to) {
  if (Range.isRange(at) && !to) {
    return at;
  }
  var start = Editor.start(editor, at);
  var end = Editor.end(editor, to || at);
  return {
    anchor: start,
    focus: end
  };
};

function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var removeMark = function removeMark(editor, key) {
  var selection = editor.selection;
  if (selection) {
    var match = function match(node, path) {
      if (!Text.isText(node)) {
        return false; // marks can only be applied to text
      }

      var _Editor$parent = Editor.parent(editor, path),
        _Editor$parent2 = _slicedToArray(_Editor$parent, 2),
        parentNode = _Editor$parent2[0];
        _Editor$parent2[1];
      return !editor.isVoid(parentNode) || editor.markableVoid(parentNode);
    };
    var expandedSelection = Range.isExpanded(selection);
    var markAcceptingVoidSelected = false;
    if (!expandedSelection) {
      var _Editor$node = Editor.node(editor, selection),
        _Editor$node2 = _slicedToArray(_Editor$node, 2),
        selectedNode = _Editor$node2[0],
        selectedPath = _Editor$node2[1];
      if (selectedNode && match(selectedNode, selectedPath)) {
        var _Editor$parent3 = Editor.parent(editor, selectedPath),
          _Editor$parent4 = _slicedToArray(_Editor$parent3, 1),
          parentNode = _Editor$parent4[0];
        markAcceptingVoidSelected = parentNode && editor.markableVoid(parentNode);
      }
    }
    if (expandedSelection || markAcceptingVoidSelected) {
      Transforms.unsetNodes(editor, key, {
        match: match,
        split: true,
        voids: true
      });
    } else {
      var marks = _objectSpread$2({}, Editor.marks(editor) || {});
      delete marks[key];
      editor.marks = marks;
      if (!FLUSHING.get(editor)) {
        editor.onChange();
      }
    }
  }
};

var setNormalizing = function setNormalizing(editor, isNormalizing) {
  NORMALIZING.set(editor, isNormalizing);
};

var start = function start(editor, at) {
  return Editor.point(editor, at, {
    edge: 'start'
  });
};

function _createForOfIteratorHelper$8(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$8(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$8(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$8(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$8(o, minLen); }
function _arrayLikeToArray$8(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var string = function string(editor, at) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$voids = options.voids,
    voids = _options$voids === void 0 ? false : _options$voids;
  var range = Editor.range(editor, at);
  var _Range$edges = Range.edges(range),
    _Range$edges2 = _slicedToArray(_Range$edges, 2),
    start = _Range$edges2[0],
    end = _Range$edges2[1];
  var text = '';
  var _iterator = _createForOfIteratorHelper$8(Editor.nodes(editor, {
      at: range,
      match: Text.isText,
      voids: voids
    })),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        node = _step$value[0],
        path = _step$value[1];
      var t = node.text;
      if (Path.equals(path, end.path)) {
        t = t.slice(0, end.offset);
      }
      if (Path.equals(path, start.path)) {
        t = t.slice(start.offset);
      }
      text += t;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return text;
};

function _createForOfIteratorHelper$7(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$7(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$7(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$7(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$7(o, minLen); }
function _arrayLikeToArray$7(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var unhangRange = function unhangRange(editor, range) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$voids = options.voids,
    voids = _options$voids === void 0 ? false : _options$voids;
  var _Range$edges = Range.edges(range),
    _Range$edges2 = _slicedToArray(_Range$edges, 2),
    start = _Range$edges2[0],
    end = _Range$edges2[1];
  // PERF: exit early if we can guarantee that the range isn't hanging.
  if (start.offset !== 0 || end.offset !== 0 || Range.isCollapsed(range) || Path.hasPrevious(end.path)) {
    return range;
  }
  var endBlock = Editor.above(editor, {
    at: end,
    match: function match(n) {
      return Element.isElement(n) && Editor.isBlock(editor, n);
    },
    voids: voids
  });
  var blockPath = endBlock ? endBlock[1] : [];
  var first = Editor.start(editor, start);
  var before = {
    anchor: first,
    focus: end
  };
  var skip = true;
  var _iterator = _createForOfIteratorHelper$7(Editor.nodes(editor, {
      at: before,
      match: Text.isText,
      reverse: true,
      voids: voids
    })),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        node = _step$value[0],
        path = _step$value[1];
      if (skip) {
        skip = false;
        continue;
      }
      if (node.text !== '' || Path.isBefore(path, blockPath)) {
        end = {
          path: path,
          offset: node.text.length
        };
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    anchor: start,
    focus: end
  };
};

var withoutNormalizing = function withoutNormalizing(editor, fn) {
  var value = Editor.isNormalizing(editor);
  Editor.setNormalizing(editor, false);
  try {
    fn();
  } finally {
    Editor.setNormalizing(editor, value);
  }
  Editor.normalize(editor);
};

function _createForOfIteratorHelper$6(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$6(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$6(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$6(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen); }
function _arrayLikeToArray$6(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var deleteText = function deleteText(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Editor.withoutNormalizing(editor, function () {
    var _Editor$void, _Editor$void2;
    var _options$reverse = options.reverse,
      reverse = _options$reverse === void 0 ? false : _options$reverse,
      _options$unit = options.unit,
      unit = _options$unit === void 0 ? 'character' : _options$unit,
      _options$distance = options.distance,
      distance = _options$distance === void 0 ? 1 : _options$distance,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    var _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      _options$hanging = options.hanging,
      hanging = _options$hanging === void 0 ? false : _options$hanging;
    if (!at) {
      return;
    }
    var isCollapsed = false;
    if (Range.isRange(at) && Range.isCollapsed(at)) {
      isCollapsed = true;
      at = at.anchor;
    }
    if (Point.isPoint(at)) {
      var furthestVoid = Editor["void"](editor, {
        at: at,
        mode: 'highest'
      });
      if (!voids && furthestVoid) {
        var _furthestVoid = _slicedToArray(furthestVoid, 2),
          voidPath = _furthestVoid[1];
        at = voidPath;
      } else {
        var opts = {
          unit: unit,
          distance: distance
        };
        var target = reverse ? Editor.before(editor, at, opts) || Editor.start(editor, []) : Editor.after(editor, at, opts) || Editor.end(editor, []);
        at = {
          anchor: at,
          focus: target
        };
        hanging = true;
      }
    }
    if (Path.isPath(at)) {
      Transforms.removeNodes(editor, {
        at: at,
        voids: voids
      });
      return;
    }
    if (Range.isCollapsed(at)) {
      return;
    }
    if (!hanging) {
      var _Range$edges = Range.edges(at),
        _Range$edges2 = _slicedToArray(_Range$edges, 2),
        _end = _Range$edges2[1];
      var endOfDoc = Editor.end(editor, []);
      if (!Point.equals(_end, endOfDoc)) {
        at = Editor.unhangRange(editor, at, {
          voids: voids
        });
      }
    }
    var _Range$edges3 = Range.edges(at),
      _Range$edges4 = _slicedToArray(_Range$edges3, 2),
      start = _Range$edges4[0],
      end = _Range$edges4[1];
    var startBlock = Editor.above(editor, {
      match: function match(n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      },
      at: start,
      voids: voids
    });
    var endBlock = Editor.above(editor, {
      match: function match(n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      },
      at: end,
      voids: voids
    });
    var isAcrossBlocks = startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1]);
    var isSingleText = Path.equals(start.path, end.path);
    var startNonEditable = voids ? null : (_Editor$void = Editor["void"](editor, {
      at: start,
      mode: 'highest'
    })) !== null && _Editor$void !== void 0 ? _Editor$void : Editor.elementReadOnly(editor, {
      at: start,
      mode: 'highest'
    });
    var endNonEditable = voids ? null : (_Editor$void2 = Editor["void"](editor, {
      at: end,
      mode: 'highest'
    })) !== null && _Editor$void2 !== void 0 ? _Editor$void2 : Editor.elementReadOnly(editor, {
      at: end,
      mode: 'highest'
    });
    // If the start or end points are inside an inline void, nudge them out.
    if (startNonEditable) {
      var before = Editor.before(editor, start);
      if (before && startBlock && Path.isAncestor(startBlock[1], before.path)) {
        start = before;
      }
    }
    if (endNonEditable) {
      var after = Editor.after(editor, end);
      if (after && endBlock && Path.isAncestor(endBlock[1], after.path)) {
        end = after;
      }
    }
    // Get the highest nodes that are completely inside the range, as well as
    // the start and end nodes.
    var matches = [];
    var lastPath;
    var _iterator = _createForOfIteratorHelper$6(Editor.nodes(editor, {
        at: at,
        voids: voids
      })),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        var _entry = _slicedToArray(entry, 2),
          _node2 = _entry[0],
          _path2 = _entry[1];
        if (lastPath && Path.compare(_path2, lastPath) === 0) {
          continue;
        }
        if (!voids && Element.isElement(_node2) && (Editor.isVoid(editor, _node2) || Editor.isElementReadOnly(editor, _node2)) || !Path.isCommon(_path2, start.path) && !Path.isCommon(_path2, end.path)) {
          matches.push(entry);
          lastPath = _path2;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var pathRefs = Array.from(matches, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        p = _ref2[1];
      return Editor.pathRef(editor, p);
    });
    var startRef = Editor.pointRef(editor, start);
    var endRef = Editor.pointRef(editor, end);
    var removedText = '';
    if (!isSingleText && !startNonEditable) {
      var _point = startRef.current;
      var _Editor$leaf = Editor.leaf(editor, _point),
        _Editor$leaf2 = _slicedToArray(_Editor$leaf, 1),
        node = _Editor$leaf2[0];
      var path = _point.path;
      var _start = start,
        offset = _start.offset;
      var text = node.text.slice(offset);
      if (text.length > 0) {
        editor.apply({
          type: 'remove_text',
          path: path,
          offset: offset,
          text: text
        });
        removedText = text;
      }
    }
    pathRefs.reverse().map(function (r) {
      return r.unref();
    }).filter(function (r) {
      return r !== null;
    }).forEach(function (p) {
      return Transforms.removeNodes(editor, {
        at: p,
        voids: voids
      });
    });
    if (!endNonEditable) {
      var _point2 = endRef.current;
      var _Editor$leaf3 = Editor.leaf(editor, _point2),
        _Editor$leaf4 = _slicedToArray(_Editor$leaf3, 1),
        _node = _Editor$leaf4[0];
      var _path = _point2.path;
      var _offset = isSingleText ? start.offset : 0;
      var _text = _node.text.slice(_offset, end.offset);
      if (_text.length > 0) {
        editor.apply({
          type: 'remove_text',
          path: _path,
          offset: _offset,
          text: _text
        });
        removedText = _text;
      }
    }
    if (!isSingleText && isAcrossBlocks && endRef.current && startRef.current) {
      Transforms.mergeNodes(editor, {
        at: endRef.current,
        hanging: true,
        voids: voids
      });
    }
    // For Thai script, deleting N character(s) backward should delete
    // N code point(s) instead of an entire grapheme cluster.
    // Therefore, the remaining code points should be inserted back.
    if (isCollapsed && reverse && unit === 'character' && removedText.length > 1 && removedText.match(/[\u0E00-\u0E7F]+/)) {
      Transforms.insertText(editor, removedText.slice(0, removedText.length - distance));
    }
    var startUnref = startRef.unref();
    var endUnref = endRef.unref();
    var point = reverse ? startUnref || endUnref : endUnref || startUnref;
    if (options.at == null && point) {
      Transforms.select(editor, point);
    }
  });
};

function _createForOfIteratorHelper$5(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$5(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$5(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$5(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen); }
function _arrayLikeToArray$5(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var insertFragment = function insertFragment(editor, fragment) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Editor.withoutNormalizing(editor, function () {
    var _options$hanging = options.hanging,
      hanging = _options$hanging === void 0 ? false : _options$hanging,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    var _options$at = options.at,
      at = _options$at === void 0 ? getDefaultInsertLocation(editor) : _options$at;
    if (!fragment.length) {
      return;
    }
    if (Range.isRange(at)) {
      if (!hanging) {
        at = Editor.unhangRange(editor, at, {
          voids: voids
        });
      }
      if (Range.isCollapsed(at)) {
        at = at.anchor;
      } else {
        var _Range$edges = Range.edges(at),
          _Range$edges2 = _slicedToArray(_Range$edges, 2),
          end = _Range$edges2[1];
        if (!voids && Editor["void"](editor, {
          at: end
        })) {
          return;
        }
        var pointRef = Editor.pointRef(editor, end);
        Transforms["delete"](editor, {
          at: at
        });
        at = pointRef.unref();
      }
    } else if (Path.isPath(at)) {
      at = Editor.start(editor, at);
    }
    if (!voids && Editor["void"](editor, {
      at: at
    })) {
      return;
    }
    // If the insert point is at the edge of an inline node, move it outside
    // instead since it will need to be split otherwise.
    var inlineElementMatch = Editor.above(editor, {
      at: at,
      match: function match(n) {
        return Element.isElement(n) && Editor.isInline(editor, n);
      },
      mode: 'highest',
      voids: voids
    });
    if (inlineElementMatch) {
      var _inlineElementMatch = _slicedToArray(inlineElementMatch, 2),
        _inlinePath = _inlineElementMatch[1];
      if (Editor.isEnd(editor, at, _inlinePath)) {
        var after = Editor.after(editor, _inlinePath);
        at = after;
      } else if (Editor.isStart(editor, at, _inlinePath)) {
        var before = Editor.before(editor, _inlinePath);
        at = before;
      }
    }
    var blockMatch = Editor.above(editor, {
      match: function match(n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      },
      at: at,
      voids: voids
    });
    var _blockMatch = _slicedToArray(blockMatch, 2),
      blockPath = _blockMatch[1];
    var isBlockStart = Editor.isStart(editor, at, blockPath);
    var isBlockEnd = Editor.isEnd(editor, at, blockPath);
    var isBlockEmpty = isBlockStart && isBlockEnd;
    var mergeStart = !isBlockStart || isBlockStart && isBlockEnd;
    var mergeEnd = !isBlockEnd;
    var _Node$first = Node.first({
        children: fragment
      }, []),
      _Node$first2 = _slicedToArray(_Node$first, 2),
      firstPath = _Node$first2[1];
    var _Node$last = Node.last({
        children: fragment
      }, []),
      _Node$last2 = _slicedToArray(_Node$last, 2),
      lastPath = _Node$last2[1];
    var matches = [];
    var matcher = function matcher(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        n = _ref2[0],
        p = _ref2[1];
      var isRoot = p.length === 0;
      if (isRoot) {
        return false;
      }
      if (isBlockEmpty) {
        return true;
      }
      if (mergeStart && Path.isAncestor(p, firstPath) && Element.isElement(n) && !editor.isVoid(n) && !editor.isInline(n)) {
        return false;
      }
      if (mergeEnd && Path.isAncestor(p, lastPath) && Element.isElement(n) && !editor.isVoid(n) && !editor.isInline(n)) {
        return false;
      }
      return true;
    };
    var _iterator = _createForOfIteratorHelper$5(Node.nodes({
        children: fragment
      }, {
        pass: matcher
      })),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (matcher(entry)) {
          matches.push(entry);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var starts = [];
    var middles = [];
    var ends = [];
    var starting = true;
    var hasBlocks = false;
    for (var _i = 0, _matches = matches; _i < _matches.length; _i++) {
      var _matches$_i = _slicedToArray(_matches[_i], 1),
        node = _matches$_i[0];
      if (Element.isElement(node) && !editor.isInline(node)) {
        starting = false;
        hasBlocks = true;
        middles.push(node);
      } else if (starting) {
        starts.push(node);
      } else {
        ends.push(node);
      }
    }
    var _Editor$nodes = Editor.nodes(editor, {
        at: at,
        match: function match(n) {
          return Text.isText(n) || Editor.isInline(editor, n);
        },
        mode: 'highest',
        voids: voids
      }),
      _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
      inlineMatch = _Editor$nodes2[0];
    var _inlineMatch = _slicedToArray(inlineMatch, 2),
      inlinePath = _inlineMatch[1];
    var isInlineStart = Editor.isStart(editor, at, inlinePath);
    var isInlineEnd = Editor.isEnd(editor, at, inlinePath);
    var middleRef = Editor.pathRef(editor, isBlockEnd && !ends.length ? Path.next(blockPath) : blockPath);
    var endRef = Editor.pathRef(editor, isInlineEnd ? Path.next(inlinePath) : inlinePath);
    Transforms.splitNodes(editor, {
      at: at,
      match: function match(n) {
        return hasBlocks ? Element.isElement(n) && Editor.isBlock(editor, n) : Text.isText(n) || Editor.isInline(editor, n);
      },
      mode: hasBlocks ? 'lowest' : 'highest',
      always: hasBlocks && (!isBlockStart || starts.length > 0) && (!isBlockEnd || ends.length > 0),
      voids: voids
    });
    var startRef = Editor.pathRef(editor, !isInlineStart || isInlineStart && isInlineEnd ? Path.next(inlinePath) : inlinePath);
    Transforms.insertNodes(editor, starts, {
      at: startRef.current,
      match: function match(n) {
        return Text.isText(n) || Editor.isInline(editor, n);
      },
      mode: 'highest',
      voids: voids
    });
    if (isBlockEmpty && !starts.length && middles.length && !ends.length) {
      Transforms["delete"](editor, {
        at: blockPath,
        voids: voids
      });
    }
    Transforms.insertNodes(editor, middles, {
      at: middleRef.current,
      match: function match(n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      },
      mode: 'lowest',
      voids: voids
    });
    Transforms.insertNodes(editor, ends, {
      at: endRef.current,
      match: function match(n) {
        return Text.isText(n) || Editor.isInline(editor, n);
      },
      mode: 'highest',
      voids: voids
    });
    if (!options.at) {
      var path;
      if (ends.length > 0 && endRef.current) {
        path = Path.previous(endRef.current);
      } else if (middles.length > 0 && middleRef.current) {
        path = Path.previous(middleRef.current);
      } else if (startRef.current) {
        path = Path.previous(startRef.current);
      }
      if (path) {
        var _end = Editor.end(editor, path);
        Transforms.select(editor, _end);
      }
    }
    startRef.unref();
    middleRef.unref();
    endRef.unref();
  });
};

var collapse = function collapse(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$edge = options.edge,
    edge = _options$edge === void 0 ? 'anchor' : _options$edge;
  var selection = editor.selection;
  if (!selection) {
    return;
  } else if (edge === 'anchor') {
    Transforms.select(editor, selection.anchor);
  } else if (edge === 'focus') {
    Transforms.select(editor, selection.focus);
  } else if (edge === 'start') {
    var _Range$edges = Range.edges(selection),
      _Range$edges2 = _slicedToArray(_Range$edges, 1),
      start = _Range$edges2[0];
    Transforms.select(editor, start);
  } else if (edge === 'end') {
    var _Range$edges3 = Range.edges(selection),
      _Range$edges4 = _slicedToArray(_Range$edges3, 2),
      end = _Range$edges4[1];
    Transforms.select(editor, end);
  }
};

var deselect = function deselect(editor) {
  var selection = editor.selection;
  if (selection) {
    editor.apply({
      type: 'set_selection',
      properties: selection,
      newProperties: null
    });
  }
};

var move = function move(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var selection = editor.selection;
  var _options$distance = options.distance,
    distance = _options$distance === void 0 ? 1 : _options$distance,
    _options$unit = options.unit,
    unit = _options$unit === void 0 ? 'character' : _options$unit,
    _options$reverse = options.reverse,
    reverse = _options$reverse === void 0 ? false : _options$reverse;
  var _options$edge = options.edge,
    edge = _options$edge === void 0 ? null : _options$edge;
  if (!selection) {
    return;
  }
  if (edge === 'start') {
    edge = Range.isBackward(selection) ? 'focus' : 'anchor';
  }
  if (edge === 'end') {
    edge = Range.isBackward(selection) ? 'anchor' : 'focus';
  }
  var anchor = selection.anchor,
    focus = selection.focus;
  var opts = {
    distance: distance,
    unit: unit,
    ignoreNonSelectable: true
  };
  var props = {};
  if (edge == null || edge === 'anchor') {
    var point = reverse ? Editor.before(editor, anchor, opts) : Editor.after(editor, anchor, opts);
    if (point) {
      props.anchor = point;
    }
  }
  if (edge == null || edge === 'focus') {
    var _point = reverse ? Editor.before(editor, focus, opts) : Editor.after(editor, focus, opts);
    if (_point) {
      props.focus = _point;
    }
  }
  Transforms.setSelection(editor, props);
};

var select = function select(editor, target) {
  var selection = editor.selection;
  target = Editor.range(editor, target);
  if (selection) {
    Transforms.setSelection(editor, target);
    return;
  }
  if (!Range.isRange(target)) {
    throw new Error("When setting the selection and the current selection is `null` you must provide at least an `anchor` and `focus`, but you passed: ".concat(Scrubber.stringify(target)));
  }
  editor.apply({
    type: 'set_selection',
    properties: selection,
    newProperties: target
  });
};

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var setPoint = function setPoint(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var selection = editor.selection;
  var _options$edge = options.edge,
    edge = _options$edge === void 0 ? 'both' : _options$edge;
  if (!selection) {
    return;
  }
  if (edge === 'start') {
    edge = Range.isBackward(selection) ? 'focus' : 'anchor';
  }
  if (edge === 'end') {
    edge = Range.isBackward(selection) ? 'anchor' : 'focus';
  }
  var anchor = selection.anchor,
    focus = selection.focus;
  var point = edge === 'anchor' ? anchor : focus;
  Transforms.setSelection(editor, _defineProperty({}, edge === 'anchor' ? 'anchor' : 'focus', _objectSpread$1(_objectSpread$1({}, point), props)));
};

var setSelection = function setSelection(editor, props) {
  var selection = editor.selection;
  var oldProps = {};
  var newProps = {};
  if (!selection) {
    return;
  }
  for (var k in props) {
    if (k === 'anchor' && props.anchor != null && !Point.equals(props.anchor, selection.anchor) || k === 'focus' && props.focus != null && !Point.equals(props.focus, selection.focus) || k !== 'anchor' && k !== 'focus' && props[k] !== selection[k]) {
      oldProps[k] = selection[k];
      newProps[k] = props[k];
    }
  }
  if (Object.keys(oldProps).length > 0) {
    editor.apply({
      type: 'set_selection',
      properties: oldProps,
      newProperties: newProps
    });
  }
};

function _createForOfIteratorHelper$4(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }
function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var insertNodes = function insertNodes(editor, nodes) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Editor.withoutNormalizing(editor, function () {
    var _options$hanging = options.hanging,
      hanging = _options$hanging === void 0 ? false : _options$hanging,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids,
      _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode;
    var at = options.at,
      match = options.match,
      select = options.select;
    if (Node.isNode(nodes)) {
      nodes = [nodes];
    }
    if (nodes.length === 0) {
      return;
    }
    var _nodes = nodes,
      _nodes2 = _slicedToArray(_nodes, 1),
      node = _nodes2[0];
    if (!at) {
      at = getDefaultInsertLocation(editor);
      if (select !== false) {
        select = true;
      }
    }
    if (select == null) {
      select = false;
    }
    if (Range.isRange(at)) {
      if (!hanging) {
        at = Editor.unhangRange(editor, at, {
          voids: voids
        });
      }
      if (Range.isCollapsed(at)) {
        at = at.anchor;
      } else {
        var _Range$edges = Range.edges(at),
          _Range$edges2 = _slicedToArray(_Range$edges, 2),
          end = _Range$edges2[1];
        var pointRef = Editor.pointRef(editor, end);
        Transforms["delete"](editor, {
          at: at
        });
        at = pointRef.unref();
      }
    }
    if (Point.isPoint(at)) {
      if (match == null) {
        if (Text.isText(node)) {
          match = function match(n) {
            return Text.isText(n);
          };
        } else if (editor.isInline(node)) {
          match = function match(n) {
            return Text.isText(n) || Editor.isInline(editor, n);
          };
        } else {
          match = function match(n) {
            return Element.isElement(n) && Editor.isBlock(editor, n);
          };
        }
      }
      var _Editor$nodes = Editor.nodes(editor, {
          at: at.path,
          match: match,
          mode: mode,
          voids: voids
        }),
        _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
        entry = _Editor$nodes2[0];
      if (entry) {
        var _entry = _slicedToArray(entry, 2),
          matchPath = _entry[1];
        var pathRef = Editor.pathRef(editor, matchPath);
        var isAtEnd = Editor.isEnd(editor, at, matchPath);
        Transforms.splitNodes(editor, {
          at: at,
          match: match,
          mode: mode,
          voids: voids
        });
        var path = pathRef.unref();
        at = isAtEnd ? Path.next(path) : path;
      } else {
        return;
      }
    }
    var parentPath = Path.parent(at);
    var index = at[at.length - 1];
    if (!voids && Editor["void"](editor, {
      at: parentPath
    })) {
      return;
    }
    var _iterator = _createForOfIteratorHelper$4(nodes),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _node = _step.value;
        var _path = parentPath.concat(index);
        index++;
        editor.apply({
          type: 'insert_node',
          path: _path,
          node: _node
        });
        at = Path.next(at);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    at = Path.previous(at);
    if (select) {
      var point = Editor.end(editor, at);
      if (point) {
        Transforms.select(editor, point);
      }
    }
  });
};

var liftNodes = function liftNodes(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Editor.withoutNormalizing(editor, function () {
    var _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    var match = options.match;
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : function (n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      };
    }
    if (!at) {
      return;
    }
    var matches = Editor.nodes(editor, {
      at: at,
      match: match,
      mode: mode,
      voids: voids
    });
    var pathRefs = Array.from(matches, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        p = _ref2[1];
      return Editor.pathRef(editor, p);
    });
    for (var _i = 0, _pathRefs = pathRefs; _i < _pathRefs.length; _i++) {
      var pathRef = _pathRefs[_i];
      var path = pathRef.unref();
      if (path.length < 2) {
        throw new Error("Cannot lift node at a path [".concat(path, "] because it has a depth of less than `2`."));
      }
      var parentNodeEntry = Editor.node(editor, Path.parent(path));
      var _parentNodeEntry = _slicedToArray(parentNodeEntry, 2),
        parent = _parentNodeEntry[0],
        parentPath = _parentNodeEntry[1];
      var index = path[path.length - 1];
      var length = parent.children.length;
      if (length === 1) {
        var toPath = Path.next(parentPath);
        Transforms.moveNodes(editor, {
          at: path,
          to: toPath,
          voids: voids
        });
        Transforms.removeNodes(editor, {
          at: parentPath,
          voids: voids
        });
      } else if (index === 0) {
        Transforms.moveNodes(editor, {
          at: path,
          to: parentPath,
          voids: voids
        });
      } else if (index === length - 1) {
        var _toPath = Path.next(parentPath);
        Transforms.moveNodes(editor, {
          at: path,
          to: _toPath,
          voids: voids
        });
      } else {
        var splitPath = Path.next(path);
        var _toPath2 = Path.next(parentPath);
        Transforms.splitNodes(editor, {
          at: splitPath,
          voids: voids
        });
        Transforms.moveNodes(editor, {
          at: path,
          to: _toPath2,
          voids: voids
        });
      }
    }
  });
};

var _excluded = ["text"],
  _excluded2 = ["children"];
var hasSingleChildNest = function hasSingleChildNest(editor, node) {
  if (Element.isElement(node)) {
    var element = node;
    if (Editor.isVoid(editor, node)) {
      return true;
    } else if (element.children.length === 1) {
      return hasSingleChildNest(editor, element.children[0]);
    } else {
      return false;
    }
  } else if (Editor.isEditor(node)) {
    return false;
  } else {
    return true;
  }
};
var mergeNodes = function mergeNodes(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Editor.withoutNormalizing(editor, function () {
    var match = options.match,
      _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at;
    var _options$hanging = options.hanging,
      hanging = _options$hanging === void 0 ? false : _options$hanging,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids,
      _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode;
    if (!at) {
      return;
    }
    if (match == null) {
      if (Path.isPath(at)) {
        var _Editor$parent = Editor.parent(editor, at),
          _Editor$parent2 = _slicedToArray(_Editor$parent, 1),
          parent = _Editor$parent2[0];
        match = function match(n) {
          return parent.children.includes(n);
        };
      } else {
        match = function match(n) {
          return Element.isElement(n) && Editor.isBlock(editor, n);
        };
      }
    }
    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, {
        voids: voids
      });
    }
    if (Range.isRange(at)) {
      if (Range.isCollapsed(at)) {
        at = at.anchor;
      } else {
        var _Range$edges = Range.edges(at),
          _Range$edges2 = _slicedToArray(_Range$edges, 2),
          end = _Range$edges2[1];
        var pointRef = Editor.pointRef(editor, end);
        Transforms["delete"](editor, {
          at: at
        });
        at = pointRef.unref();
        if (options.at == null) {
          Transforms.select(editor, at);
        }
      }
    }
    var _Editor$nodes = Editor.nodes(editor, {
        at: at,
        match: match,
        voids: voids,
        mode: mode
      }),
      _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
      current = _Editor$nodes2[0];
    var prev = Editor.previous(editor, {
      at: at,
      match: match,
      voids: voids,
      mode: mode
    });
    if (!current || !prev) {
      return;
    }
    var _current = _slicedToArray(current, 2),
      node = _current[0],
      path = _current[1];
    var _prev = _slicedToArray(prev, 2),
      prevNode = _prev[0],
      prevPath = _prev[1];
    if (path.length === 0 || prevPath.length === 0) {
      return;
    }
    var newPath = Path.next(prevPath);
    var commonPath = Path.common(path, prevPath);
    var isPreviousSibling = Path.isSibling(path, prevPath);
    var levels = Array.from(Editor.levels(editor, {
      at: path
    }), function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
        n = _ref2[0];
      return n;
    }).slice(commonPath.length).slice(0, -1);
    // Determine if the merge will leave an ancestor of the path empty as a
    // result, in which case we'll want to remove it after merging.
    var emptyAncestor = Editor.above(editor, {
      at: path,
      mode: 'highest',
      match: function match(n) {
        return levels.includes(n) && hasSingleChildNest(editor, n);
      }
    });
    var emptyRef = emptyAncestor && Editor.pathRef(editor, emptyAncestor[1]);
    var properties;
    var position;
    // Ensure that the nodes are equivalent, and figure out what the position
    // and extra properties of the merge will be.
    if (Text.isText(node) && Text.isText(prevNode)) {
      node.text;
        var rest = _objectWithoutProperties(node, _excluded);
      position = prevNode.text.length;
      properties = rest;
    } else if (Element.isElement(node) && Element.isElement(prevNode)) {
      node.children;
        var _rest = _objectWithoutProperties(node, _excluded2);
      position = prevNode.children.length;
      properties = _rest;
    } else {
      throw new Error("Cannot merge the node at path [".concat(path, "] with the previous sibling because it is not the same kind: ").concat(Scrubber.stringify(node), " ").concat(Scrubber.stringify(prevNode)));
    }
    // If the node isn't already the next sibling of the previous node, move
    // it so that it is before merging.
    if (!isPreviousSibling) {
      Transforms.moveNodes(editor, {
        at: path,
        to: newPath,
        voids: voids
      });
    }
    // If there was going to be an empty ancestor of the node that was merged,
    // we remove it from the tree.
    if (emptyRef) {
      Transforms.removeNodes(editor, {
        at: emptyRef.current,
        voids: voids
      });
    }
    // If the target node that we're merging with is empty, remove it instead
    // of merging the two. This is a common rich text editor behavior to
    // prevent losing formatting when deleting entire nodes when you have a
    // hanging selection.
    // if prevNode is first child in parent,don't remove it.
    if (Element.isElement(prevNode) && Editor.isEmpty(editor, prevNode) || Text.isText(prevNode) && prevNode.text === '' && prevPath[prevPath.length - 1] !== 0) {
      Transforms.removeNodes(editor, {
        at: prevPath,
        voids: voids
      });
    } else {
      editor.apply({
        type: 'merge_node',
        path: newPath,
        position: position,
        properties: properties
      });
    }
    if (emptyRef) {
      emptyRef.unref();
    }
  });
};

var moveNodes = function moveNodes(editor, options) {
  Editor.withoutNormalizing(editor, function () {
    var to = options.to,
      _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    var match = options.match;
    if (!at) {
      return;
    }
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : function (n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      };
    }
    var toRef = Editor.pathRef(editor, to);
    var targets = Editor.nodes(editor, {
      at: at,
      match: match,
      mode: mode,
      voids: voids
    });
    var pathRefs = Array.from(targets, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        p = _ref2[1];
      return Editor.pathRef(editor, p);
    });
    for (var _i = 0, _pathRefs = pathRefs; _i < _pathRefs.length; _i++) {
      var pathRef = _pathRefs[_i];
      var path = pathRef.unref();
      var newPath = toRef.current;
      if (path.length !== 0) {
        editor.apply({
          type: 'move_node',
          path: path,
          newPath: newPath
        });
      }
      if (toRef.current && Path.isSibling(newPath, path) && Path.isAfter(newPath, path)) {
        // When performing a sibling move to a later index, the path at the destination is shifted
        // to before the insertion point instead of after. To ensure our group of nodes are inserted
        // in the correct order we increment toRef to account for that
        toRef.current = Path.next(toRef.current);
      }
    }
    toRef.unref();
  });
};

var removeNodes = function removeNodes(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Editor.withoutNormalizing(editor, function () {
    var _options$hanging = options.hanging,
      hanging = _options$hanging === void 0 ? false : _options$hanging,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids,
      _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode;
    var _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      match = options.match;
    if (!at) {
      return;
    }
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : function (n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      };
    }
    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, {
        voids: voids
      });
    }
    var depths = Editor.nodes(editor, {
      at: at,
      match: match,
      mode: mode,
      voids: voids
    });
    var pathRefs = Array.from(depths, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        p = _ref2[1];
      return Editor.pathRef(editor, p);
    });
    for (var _i = 0, _pathRefs = pathRefs; _i < _pathRefs.length; _i++) {
      var pathRef = _pathRefs[_i];
      var path = pathRef.unref();
      if (path) {
        var _Editor$node = Editor.node(editor, path),
          _Editor$node2 = _slicedToArray(_Editor$node, 1),
          node = _Editor$node2[0];
        editor.apply({
          type: 'remove_node',
          path: path,
          node: node
        });
      }
    }
  });
};

function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }
function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var setNodes = function setNodes(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Editor.withoutNormalizing(editor, function () {
    var match = options.match,
      _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      compare = options.compare,
      merge = options.merge;
    var _options$hanging = options.hanging,
      hanging = _options$hanging === void 0 ? false : _options$hanging,
      _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode,
      _options$split = options.split,
      split = _options$split === void 0 ? false : _options$split,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    if (!at) {
      return;
    }
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : function (n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      };
    }
    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, {
        voids: voids
      });
    }
    if (split && Range.isRange(at)) {
      if (Range.isCollapsed(at) && Editor.leaf(editor, at.anchor)[0].text.length > 0) {
        // If the range is collapsed in a non-empty node and 'split' is true, there's nothing to
        // set that won't get normalized away
        return;
      }
      var rangeRef = Editor.rangeRef(editor, at, {
        affinity: 'inward'
      });
      var _Range$edges = Range.edges(at),
        _Range$edges2 = _slicedToArray(_Range$edges, 2),
        start = _Range$edges2[0],
        end = _Range$edges2[1];
      var splitMode = mode === 'lowest' ? 'lowest' : 'highest';
      var endAtEndOfNode = Editor.isEnd(editor, end, end.path);
      Transforms.splitNodes(editor, {
        at: end,
        match: match,
        mode: splitMode,
        voids: voids,
        always: !endAtEndOfNode
      });
      var startAtStartOfNode = Editor.isStart(editor, start, start.path);
      Transforms.splitNodes(editor, {
        at: start,
        match: match,
        mode: splitMode,
        voids: voids,
        always: !startAtStartOfNode
      });
      at = rangeRef.unref();
      if (options.at == null) {
        Transforms.select(editor, at);
      }
    }
    if (!compare) {
      compare = function compare(prop, nodeProp) {
        return prop !== nodeProp;
      };
    }
    var _iterator = _createForOfIteratorHelper$3(Editor.nodes(editor, {
        at: at,
        match: match,
        mode: mode,
        voids: voids
      })),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          node = _step$value[0],
          path = _step$value[1];
        var properties = {};
        // FIXME: is this correct?
        var newProperties = {};
        // You can't set properties on the editor node.
        if (path.length === 0) {
          continue;
        }
        var hasChanges = false;
        for (var k in props) {
          if (k === 'children' || k === 'text') {
            continue;
          }
          if (compare(props[k], node[k])) {
            hasChanges = true;
            // Omit new properties from the old properties list
            if (node.hasOwnProperty(k)) properties[k] = node[k];
            // Omit properties that have been removed from the new properties list
            if (merge) {
              if (props[k] != null) newProperties[k] = merge(node[k], props[k]);
            } else {
              if (props[k] != null) newProperties[k] = props[k];
            }
          }
        }
        if (hasChanges) {
          editor.apply({
            type: 'set_node',
            path: path,
            properties: properties,
            newProperties: newProperties
          });
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
};

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }
function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Convert a range into a point by deleting it's content.
 */
var deleteRange = function deleteRange(editor, range) {
  if (Range.isCollapsed(range)) {
    return range.anchor;
  } else {
    var _Range$edges = Range.edges(range),
      _Range$edges2 = _slicedToArray(_Range$edges, 2),
      end = _Range$edges2[1];
    var pointRef = Editor.pointRef(editor, end);
    Transforms["delete"](editor, {
      at: range
    });
    return pointRef.unref();
  }
};
var splitNodes = function splitNodes(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Editor.withoutNormalizing(editor, function () {
    var _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    var match = options.match,
      _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      _options$height = options.height,
      height = _options$height === void 0 ? 0 : _options$height,
      _options$always = options.always,
      always = _options$always === void 0 ? false : _options$always;
    if (match == null) {
      match = function match(n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      };
    }
    if (Range.isRange(at)) {
      at = deleteRange(editor, at);
    }
    // If the target is a path, the default height-skipping and position
    // counters need to account for us potentially splitting at a non-leaf.
    if (Path.isPath(at)) {
      var path = at;
      var point = Editor.point(editor, path);
      var _Editor$parent = Editor.parent(editor, path),
        _Editor$parent2 = _slicedToArray(_Editor$parent, 1),
        parent = _Editor$parent2[0];
      match = function match(n) {
        return n === parent;
      };
      height = point.path.length - path.length + 1;
      at = point;
      always = true;
    }
    if (!at) {
      return;
    }
    var beforeRef = Editor.pointRef(editor, at, {
      affinity: 'backward'
    });
    var afterRef;
    try {
      var _Editor$nodes = Editor.nodes(editor, {
          at: at,
          match: match,
          mode: mode,
          voids: voids
        }),
        _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
        highest = _Editor$nodes2[0];
      if (!highest) {
        return;
      }
      var voidMatch = Editor["void"](editor, {
        at: at,
        mode: 'highest'
      });
      var nudge = 0;
      if (!voids && voidMatch) {
        var _voidMatch = _slicedToArray(voidMatch, 2),
          voidNode = _voidMatch[0],
          voidPath = _voidMatch[1];
        if (Element.isElement(voidNode) && editor.isInline(voidNode)) {
          var after = Editor.after(editor, voidPath);
          if (!after) {
            var text = {
              text: ''
            };
            var afterPath = Path.next(voidPath);
            Transforms.insertNodes(editor, text, {
              at: afterPath,
              voids: voids
            });
            after = Editor.point(editor, afterPath);
          }
          at = after;
          always = true;
        }
        var siblingHeight = at.path.length - voidPath.length;
        height = siblingHeight + 1;
        always = true;
      }
      afterRef = Editor.pointRef(editor, at);
      var depth = at.path.length - height;
      var _highest = _slicedToArray(highest, 2),
        highestPath = _highest[1];
      var lowestPath = at.path.slice(0, depth);
      var position = height === 0 ? at.offset : at.path[depth] + nudge;
      var _iterator = _createForOfIteratorHelper$2(Editor.levels(editor, {
          at: lowestPath,
          reverse: true,
          voids: voids
        })),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            node = _step$value[0],
            _path = _step$value[1];
          var split = false;
          if (_path.length < highestPath.length || _path.length === 0 || !voids && Element.isElement(node) && Editor.isVoid(editor, node)) {
            break;
          }
          var _point2 = beforeRef.current;
          var isEnd = Editor.isEnd(editor, _point2, _path);
          if (always || !beforeRef || !Editor.isEdge(editor, _point2, _path)) {
            split = true;
            var properties = Node.extractProps(node);
            editor.apply({
              type: 'split_node',
              path: _path,
              position: position,
              properties: properties
            });
          }
          position = _path[_path.length - 1] + (split || isEnd ? 1 : 0);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (options.at == null) {
        var _point = afterRef.current || Editor.end(editor, []);
        Transforms.select(editor, _point);
      }
    } finally {
      var _afterRef;
      beforeRef.unref();
      (_afterRef = afterRef) === null || _afterRef === void 0 || _afterRef.unref();
    }
  });
};

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var unsetNodes = function unsetNodes(editor, props) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!Array.isArray(props)) {
    props = [props];
  }
  var obj = {};
  var _iterator = _createForOfIteratorHelper$1(props),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      obj[key] = null;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  Transforms.setNodes(editor, obj, options);
};

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var unwrapNodes = function unwrapNodes(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Editor.withoutNormalizing(editor, function () {
    var _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode,
      _options$split = options.split,
      split = _options$split === void 0 ? false : _options$split,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    var _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at,
      match = options.match;
    if (!at) {
      return;
    }
    if (match == null) {
      match = Path.isPath(at) ? matchPath(editor, at) : function (n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      };
    }
    if (Path.isPath(at)) {
      at = Editor.range(editor, at);
    }
    var rangeRef = Range.isRange(at) ? Editor.rangeRef(editor, at) : null;
    var matches = Editor.nodes(editor, {
      at: at,
      match: match,
      mode: mode,
      voids: voids
    });
    var pathRefs = Array.from(matches, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        p = _ref2[1];
      return Editor.pathRef(editor, p);
    }
    // unwrapNode will call liftNode which does not support splitting the node when nested.
    // If we do not reverse the order and call it from top to the bottom, it will remove all blocks
    // that wrap target node. So we reverse the order.
    ).reverse();
    var _iterator = _createForOfIteratorHelper(pathRefs),
      _step;
    try {
      var _loop = function _loop() {
        var pathRef = _step.value;
        var path = pathRef.unref();
        var _Editor$node = Editor.node(editor, path),
          _Editor$node2 = _slicedToArray(_Editor$node, 1),
          node = _Editor$node2[0];
        var range = Editor.range(editor, path);
        if (split && rangeRef) {
          range = Range.intersection(rangeRef.current, range);
        }
        Transforms.liftNodes(editor, {
          at: range,
          match: function match(n) {
            return Element.isAncestor(node) && node.children.includes(n);
          },
          voids: voids
        });
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (rangeRef) {
      rangeRef.unref();
    }
  });
};

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var wrapNodes = function wrapNodes(editor, element) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Editor.withoutNormalizing(editor, function () {
    var _options$mode = options.mode,
      mode = _options$mode === void 0 ? 'lowest' : _options$mode,
      _options$split = options.split,
      split = _options$split === void 0 ? false : _options$split,
      _options$voids = options.voids,
      voids = _options$voids === void 0 ? false : _options$voids;
    var match = options.match,
      _options$at = options.at,
      at = _options$at === void 0 ? editor.selection : _options$at;
    if (!at) {
      return;
    }
    if (match == null) {
      if (Path.isPath(at)) {
        match = matchPath(editor, at);
      } else if (editor.isInline(element)) {
        match = function match(n) {
          return Element.isElement(n) && Editor.isInline(editor, n) || Text.isText(n);
        };
      } else {
        match = function match(n) {
          return Element.isElement(n) && Editor.isBlock(editor, n);
        };
      }
    }
    if (split && Range.isRange(at)) {
      var _Range$edges = Range.edges(at),
        _Range$edges2 = _slicedToArray(_Range$edges, 2),
        start = _Range$edges2[0],
        end = _Range$edges2[1];
      var rangeRef = Editor.rangeRef(editor, at, {
        affinity: 'inward'
      });
      Transforms.splitNodes(editor, {
        at: end,
        match: match,
        voids: voids
      });
      Transforms.splitNodes(editor, {
        at: start,
        match: match,
        voids: voids
      });
      at = rangeRef.unref();
      if (options.at == null) {
        Transforms.select(editor, at);
      }
    }
    var roots = Array.from(Editor.nodes(editor, {
      at: at,
      match: editor.isInline(element) ? function (n) {
        return Element.isElement(n) && Editor.isBlock(editor, n);
      } : function (n) {
        return Editor.isEditor(n);
      },
      mode: 'lowest',
      voids: voids
    }));
    var _loop = function _loop() {
        var _roots$_i = _slicedToArray(_roots[_i], 2),
          rootPath = _roots$_i[1];
        var a = Range.isRange(at) ? Range.intersection(at, Editor.range(editor, rootPath)) : at;
        if (!a) {
          return 0; // continue
        }
        var matches = Array.from(Editor.nodes(editor, {
          at: a,
          match: match,
          mode: mode,
          voids: voids
        }));
        if (matches.length > 0) {
          var first = matches[0];
          var last = matches[matches.length - 1];
          var _first = _slicedToArray(first, 2),
            firstPath = _first[1];
          var _last = _slicedToArray(last, 2),
            lastPath = _last[1];
          if (firstPath.length === 0 && lastPath.length === 0) {
            // if there's no matching parent - usually means the node is an editor - don't do anything
            return 0; // continue
          }
          var commonPath = Path.equals(firstPath, lastPath) ? Path.parent(firstPath) : Path.common(firstPath, lastPath);
          var range = Editor.range(editor, firstPath, lastPath);
          var commonNodeEntry = Editor.node(editor, commonPath);
          var _commonNodeEntry = _slicedToArray(commonNodeEntry, 1),
            commonNode = _commonNodeEntry[0];
          var depth = commonPath.length + 1;
          var wrapperPath = Path.next(lastPath.slice(0, depth));
          var wrapper = _objectSpread(_objectSpread({}, element), {}, {
            children: []
          });
          Transforms.insertNodes(editor, wrapper, {
            at: wrapperPath,
            voids: voids
          });
          Transforms.moveNodes(editor, {
            at: range,
            match: function match(n) {
              return Element.isAncestor(commonNode) && commonNode.children.includes(n);
            },
            to: wrapperPath.concat(0),
            voids: voids
          });
        }
      },
      _ret;
    for (var _i = 0, _roots = roots; _i < _roots.length; _i++) {
      _ret = _loop();
      if (_ret === 0) continue;
    }
  });
};

/**
 * Create a new Slate `Editor` object.
 */
var createEditor = function createEditor() {
  var editor = {
    children: [],
    operations: [],
    selection: null,
    marks: null,
    isElementReadOnly: function isElementReadOnly() {
      return false;
    },
    isInline: function isInline() {
      return false;
    },
    isSelectable: function isSelectable() {
      return true;
    },
    isVoid: function isVoid() {
      return false;
    },
    markableVoid: function markableVoid() {
      return false;
    },
    onChange: function onChange() {},
    // Core
    apply: function apply$1() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return apply.apply(void 0, [editor].concat(args));
    },
    // Editor
    addMark: function addMark$1() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return addMark.apply(void 0, [editor].concat(args));
    },
    deleteBackward: function deleteBackward$1() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return deleteBackward.apply(void 0, [editor].concat(args));
    },
    deleteForward: function deleteForward$1() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return deleteForward.apply(void 0, [editor].concat(args));
    },
    deleteFragment: function deleteFragment$1() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      return deleteFragment.apply(void 0, [editor].concat(args));
    },
    getFragment: function getFragment$1() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      return getFragment.apply(void 0, [editor].concat(args));
    },
    insertBreak: function insertBreak$1() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      return insertBreak.apply(void 0, [editor].concat(args));
    },
    insertSoftBreak: function insertSoftBreak$1() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      return insertSoftBreak.apply(void 0, [editor].concat(args));
    },
    insertFragment: function insertFragment$1() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      return insertFragment.apply(void 0, [editor].concat(args));
    },
    insertNode: function insertNode$1() {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }
      return insertNode.apply(void 0, [editor].concat(args));
    },
    insertText: function insertText$1() {
      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }
      return insertText.apply(void 0, [editor].concat(args));
    },
    normalizeNode: function normalizeNode$1() {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }
      return normalizeNode.apply(void 0, [editor].concat(args));
    },
    removeMark: function removeMark$1() {
      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }
      return removeMark.apply(void 0, [editor].concat(args));
    },
    getDirtyPaths: function getDirtyPaths$1() {
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }
      return getDirtyPaths.apply(void 0, [editor].concat(args));
    },
    shouldNormalize: function shouldNormalize$1() {
      for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }
      return shouldNormalize.apply(void 0, [editor].concat(args));
    },
    // Editor interface
    above: function above$1() {
      for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }
      return above.apply(void 0, [editor].concat(args));
    },
    after: function after$1() {
      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
      }
      return after.apply(void 0, [editor].concat(args));
    },
    before: function before$1() {
      for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
        args[_key18] = arguments[_key18];
      }
      return before.apply(void 0, [editor].concat(args));
    },
    collapse: function collapse$1() {
      for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
        args[_key19] = arguments[_key19];
      }
      return collapse.apply(void 0, [editor].concat(args));
    },
    "delete": function _delete() {
      for (var _len20 = arguments.length, args = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
        args[_key20] = arguments[_key20];
      }
      return deleteText.apply(void 0, [editor].concat(args));
    },
    deselect: function deselect$1() {
      for (var _len21 = arguments.length, args = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
        args[_key21] = arguments[_key21];
      }
      return deselect.apply(void 0, [editor].concat(args));
    },
    edges: function edges$1() {
      for (var _len22 = arguments.length, args = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
        args[_key22] = arguments[_key22];
      }
      return edges.apply(void 0, [editor].concat(args));
    },
    elementReadOnly: function elementReadOnly$1() {
      for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
      }
      return elementReadOnly.apply(void 0, [editor].concat(args));
    },
    end: function end$1() {
      for (var _len24 = arguments.length, args = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
        args[_key24] = arguments[_key24];
      }
      return end.apply(void 0, [editor].concat(args));
    },
    first: function first$1() {
      for (var _len25 = arguments.length, args = new Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
        args[_key25] = arguments[_key25];
      }
      return first.apply(void 0, [editor].concat(args));
    },
    fragment: function fragment$1() {
      for (var _len26 = arguments.length, args = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
        args[_key26] = arguments[_key26];
      }
      return fragment.apply(void 0, [editor].concat(args));
    },
    getMarks: function getMarks() {
      for (var _len27 = arguments.length, args = new Array(_len27), _key27 = 0; _key27 < _len27; _key27++) {
        args[_key27] = arguments[_key27];
      }
      return marks.apply(void 0, [editor].concat(args));
    },
    hasBlocks: function hasBlocks$1() {
      for (var _len28 = arguments.length, args = new Array(_len28), _key28 = 0; _key28 < _len28; _key28++) {
        args[_key28] = arguments[_key28];
      }
      return hasBlocks.apply(void 0, [editor].concat(args));
    },
    hasInlines: function hasInlines$1() {
      for (var _len29 = arguments.length, args = new Array(_len29), _key29 = 0; _key29 < _len29; _key29++) {
        args[_key29] = arguments[_key29];
      }
      return hasInlines.apply(void 0, [editor].concat(args));
    },
    hasPath: function hasPath$1() {
      for (var _len30 = arguments.length, args = new Array(_len30), _key30 = 0; _key30 < _len30; _key30++) {
        args[_key30] = arguments[_key30];
      }
      return hasPath.apply(void 0, [editor].concat(args));
    },
    hasTexts: function hasTexts$1() {
      for (var _len31 = arguments.length, args = new Array(_len31), _key31 = 0; _key31 < _len31; _key31++) {
        args[_key31] = arguments[_key31];
      }
      return hasTexts.apply(void 0, [editor].concat(args));
    },
    insertNodes: function insertNodes$1() {
      for (var _len32 = arguments.length, args = new Array(_len32), _key32 = 0; _key32 < _len32; _key32++) {
        args[_key32] = arguments[_key32];
      }
      return insertNodes.apply(void 0, [editor].concat(args));
    },
    isBlock: function isBlock$1() {
      for (var _len33 = arguments.length, args = new Array(_len33), _key33 = 0; _key33 < _len33; _key33++) {
        args[_key33] = arguments[_key33];
      }
      return isBlock.apply(void 0, [editor].concat(args));
    },
    isEdge: function isEdge$1() {
      for (var _len34 = arguments.length, args = new Array(_len34), _key34 = 0; _key34 < _len34; _key34++) {
        args[_key34] = arguments[_key34];
      }
      return isEdge.apply(void 0, [editor].concat(args));
    },
    isEmpty: function isEmpty$1() {
      for (var _len35 = arguments.length, args = new Array(_len35), _key35 = 0; _key35 < _len35; _key35++) {
        args[_key35] = arguments[_key35];
      }
      return isEmpty.apply(void 0, [editor].concat(args));
    },
    isEnd: function isEnd$1() {
      for (var _len36 = arguments.length, args = new Array(_len36), _key36 = 0; _key36 < _len36; _key36++) {
        args[_key36] = arguments[_key36];
      }
      return isEnd.apply(void 0, [editor].concat(args));
    },
    isNormalizing: function isNormalizing$1() {
      for (var _len37 = arguments.length, args = new Array(_len37), _key37 = 0; _key37 < _len37; _key37++) {
        args[_key37] = arguments[_key37];
      }
      return isNormalizing.apply(void 0, [editor].concat(args));
    },
    isStart: function isStart$1() {
      for (var _len38 = arguments.length, args = new Array(_len38), _key38 = 0; _key38 < _len38; _key38++) {
        args[_key38] = arguments[_key38];
      }
      return isStart.apply(void 0, [editor].concat(args));
    },
    last: function last$1() {
      for (var _len39 = arguments.length, args = new Array(_len39), _key39 = 0; _key39 < _len39; _key39++) {
        args[_key39] = arguments[_key39];
      }
      return last.apply(void 0, [editor].concat(args));
    },
    leaf: function leaf$1() {
      for (var _len40 = arguments.length, args = new Array(_len40), _key40 = 0; _key40 < _len40; _key40++) {
        args[_key40] = arguments[_key40];
      }
      return leaf.apply(void 0, [editor].concat(args));
    },
    levels: function levels$1() {
      for (var _len41 = arguments.length, args = new Array(_len41), _key41 = 0; _key41 < _len41; _key41++) {
        args[_key41] = arguments[_key41];
      }
      return levels.apply(void 0, [editor].concat(args));
    },
    liftNodes: function liftNodes$1() {
      for (var _len42 = arguments.length, args = new Array(_len42), _key42 = 0; _key42 < _len42; _key42++) {
        args[_key42] = arguments[_key42];
      }
      return liftNodes.apply(void 0, [editor].concat(args));
    },
    mergeNodes: function mergeNodes$1() {
      for (var _len43 = arguments.length, args = new Array(_len43), _key43 = 0; _key43 < _len43; _key43++) {
        args[_key43] = arguments[_key43];
      }
      return mergeNodes.apply(void 0, [editor].concat(args));
    },
    move: function move$1() {
      for (var _len44 = arguments.length, args = new Array(_len44), _key44 = 0; _key44 < _len44; _key44++) {
        args[_key44] = arguments[_key44];
      }
      return move.apply(void 0, [editor].concat(args));
    },
    moveNodes: function moveNodes$1() {
      for (var _len45 = arguments.length, args = new Array(_len45), _key45 = 0; _key45 < _len45; _key45++) {
        args[_key45] = arguments[_key45];
      }
      return moveNodes.apply(void 0, [editor].concat(args));
    },
    next: function next$1() {
      for (var _len46 = arguments.length, args = new Array(_len46), _key46 = 0; _key46 < _len46; _key46++) {
        args[_key46] = arguments[_key46];
      }
      return next.apply(void 0, [editor].concat(args));
    },
    node: function node$1() {
      for (var _len47 = arguments.length, args = new Array(_len47), _key47 = 0; _key47 < _len47; _key47++) {
        args[_key47] = arguments[_key47];
      }
      return node.apply(void 0, [editor].concat(args));
    },
    nodes: function nodes$1() {
      for (var _len48 = arguments.length, args = new Array(_len48), _key48 = 0; _key48 < _len48; _key48++) {
        args[_key48] = arguments[_key48];
      }
      return nodes.apply(void 0, [editor].concat(args));
    },
    normalize: function normalize$1() {
      for (var _len49 = arguments.length, args = new Array(_len49), _key49 = 0; _key49 < _len49; _key49++) {
        args[_key49] = arguments[_key49];
      }
      return normalize.apply(void 0, [editor].concat(args));
    },
    parent: function parent$1() {
      for (var _len50 = arguments.length, args = new Array(_len50), _key50 = 0; _key50 < _len50; _key50++) {
        args[_key50] = arguments[_key50];
      }
      return parent.apply(void 0, [editor].concat(args));
    },
    path: function path$1() {
      for (var _len51 = arguments.length, args = new Array(_len51), _key51 = 0; _key51 < _len51; _key51++) {
        args[_key51] = arguments[_key51];
      }
      return path.apply(void 0, [editor].concat(args));
    },
    pathRef: function pathRef$1() {
      for (var _len52 = arguments.length, args = new Array(_len52), _key52 = 0; _key52 < _len52; _key52++) {
        args[_key52] = arguments[_key52];
      }
      return pathRef.apply(void 0, [editor].concat(args));
    },
    pathRefs: function pathRefs$1() {
      for (var _len53 = arguments.length, args = new Array(_len53), _key53 = 0; _key53 < _len53; _key53++) {
        args[_key53] = arguments[_key53];
      }
      return pathRefs.apply(void 0, [editor].concat(args));
    },
    point: function point$1() {
      for (var _len54 = arguments.length, args = new Array(_len54), _key54 = 0; _key54 < _len54; _key54++) {
        args[_key54] = arguments[_key54];
      }
      return point.apply(void 0, [editor].concat(args));
    },
    pointRef: function pointRef$1() {
      for (var _len55 = arguments.length, args = new Array(_len55), _key55 = 0; _key55 < _len55; _key55++) {
        args[_key55] = arguments[_key55];
      }
      return pointRef.apply(void 0, [editor].concat(args));
    },
    pointRefs: function pointRefs$1() {
      for (var _len56 = arguments.length, args = new Array(_len56), _key56 = 0; _key56 < _len56; _key56++) {
        args[_key56] = arguments[_key56];
      }
      return pointRefs.apply(void 0, [editor].concat(args));
    },
    positions: function positions$1() {
      for (var _len57 = arguments.length, args = new Array(_len57), _key57 = 0; _key57 < _len57; _key57++) {
        args[_key57] = arguments[_key57];
      }
      return positions.apply(void 0, [editor].concat(args));
    },
    previous: function previous$1() {
      for (var _len58 = arguments.length, args = new Array(_len58), _key58 = 0; _key58 < _len58; _key58++) {
        args[_key58] = arguments[_key58];
      }
      return previous.apply(void 0, [editor].concat(args));
    },
    range: function range$1() {
      for (var _len59 = arguments.length, args = new Array(_len59), _key59 = 0; _key59 < _len59; _key59++) {
        args[_key59] = arguments[_key59];
      }
      return range.apply(void 0, [editor].concat(args));
    },
    rangeRef: function rangeRef$1() {
      for (var _len60 = arguments.length, args = new Array(_len60), _key60 = 0; _key60 < _len60; _key60++) {
        args[_key60] = arguments[_key60];
      }
      return rangeRef.apply(void 0, [editor].concat(args));
    },
    rangeRefs: function rangeRefs$1() {
      for (var _len61 = arguments.length, args = new Array(_len61), _key61 = 0; _key61 < _len61; _key61++) {
        args[_key61] = arguments[_key61];
      }
      return rangeRefs.apply(void 0, [editor].concat(args));
    },
    removeNodes: function removeNodes$1() {
      for (var _len62 = arguments.length, args = new Array(_len62), _key62 = 0; _key62 < _len62; _key62++) {
        args[_key62] = arguments[_key62];
      }
      return removeNodes.apply(void 0, [editor].concat(args));
    },
    select: function select$1() {
      for (var _len63 = arguments.length, args = new Array(_len63), _key63 = 0; _key63 < _len63; _key63++) {
        args[_key63] = arguments[_key63];
      }
      return select.apply(void 0, [editor].concat(args));
    },
    setNodes: function setNodes$1() {
      for (var _len64 = arguments.length, args = new Array(_len64), _key64 = 0; _key64 < _len64; _key64++) {
        args[_key64] = arguments[_key64];
      }
      return setNodes.apply(void 0, [editor].concat(args));
    },
    setNormalizing: function setNormalizing$1() {
      for (var _len65 = arguments.length, args = new Array(_len65), _key65 = 0; _key65 < _len65; _key65++) {
        args[_key65] = arguments[_key65];
      }
      return setNormalizing.apply(void 0, [editor].concat(args));
    },
    setPoint: function setPoint$1() {
      for (var _len66 = arguments.length, args = new Array(_len66), _key66 = 0; _key66 < _len66; _key66++) {
        args[_key66] = arguments[_key66];
      }
      return setPoint.apply(void 0, [editor].concat(args));
    },
    setSelection: function setSelection$1() {
      for (var _len67 = arguments.length, args = new Array(_len67), _key67 = 0; _key67 < _len67; _key67++) {
        args[_key67] = arguments[_key67];
      }
      return setSelection.apply(void 0, [editor].concat(args));
    },
    splitNodes: function splitNodes$1() {
      for (var _len68 = arguments.length, args = new Array(_len68), _key68 = 0; _key68 < _len68; _key68++) {
        args[_key68] = arguments[_key68];
      }
      return splitNodes.apply(void 0, [editor].concat(args));
    },
    start: function start$1() {
      for (var _len69 = arguments.length, args = new Array(_len69), _key69 = 0; _key69 < _len69; _key69++) {
        args[_key69] = arguments[_key69];
      }
      return start.apply(void 0, [editor].concat(args));
    },
    string: function string$1() {
      for (var _len70 = arguments.length, args = new Array(_len70), _key70 = 0; _key70 < _len70; _key70++) {
        args[_key70] = arguments[_key70];
      }
      return string.apply(void 0, [editor].concat(args));
    },
    unhangRange: function unhangRange$1() {
      for (var _len71 = arguments.length, args = new Array(_len71), _key71 = 0; _key71 < _len71; _key71++) {
        args[_key71] = arguments[_key71];
      }
      return unhangRange.apply(void 0, [editor].concat(args));
    },
    unsetNodes: function unsetNodes$1() {
      for (var _len72 = arguments.length, args = new Array(_len72), _key72 = 0; _key72 < _len72; _key72++) {
        args[_key72] = arguments[_key72];
      }
      return unsetNodes.apply(void 0, [editor].concat(args));
    },
    unwrapNodes: function unwrapNodes$1() {
      for (var _len73 = arguments.length, args = new Array(_len73), _key73 = 0; _key73 < _len73; _key73++) {
        args[_key73] = arguments[_key73];
      }
      return unwrapNodes.apply(void 0, [editor].concat(args));
    },
    "void": function _void() {
      for (var _len74 = arguments.length, args = new Array(_len74), _key74 = 0; _key74 < _len74; _key74++) {
        args[_key74] = arguments[_key74];
      }
      return getVoid.apply(void 0, [editor].concat(args));
    },
    withoutNormalizing: function withoutNormalizing$1() {
      for (var _len75 = arguments.length, args = new Array(_len75), _key75 = 0; _key75 < _len75; _key75++) {
        args[_key75] = arguments[_key75];
      }
      return withoutNormalizing.apply(void 0, [editor].concat(args));
    },
    wrapNodes: function wrapNodes$1() {
      for (var _len76 = arguments.length, args = new Array(_len76), _key76 = 0; _key76 < _len76; _key76++) {
        args[_key76] = arguments[_key76];
      }
      return wrapNodes.apply(void 0, [editor].concat(args));
    }
  };
  return editor;
};

exports.Editor = Editor;
exports.Element = Element;
exports.Location = Location;
exports.Node = Node;
exports.Operation = Operation;
exports.Path = Path;
exports.PathRef = PathRef;
exports.Point = Point;
exports.PointRef = PointRef;
exports.Range = Range;
exports.RangeRef = RangeRef;
exports.Scrubber = Scrubber;
exports.Span = Span;
exports.Text = Text;
exports.Transforms = Transforms;
exports.above = above;
exports.addMark = addMark;
exports.after = after;
exports.apply = apply;
exports.before = before;
exports.collapse = collapse;
exports.createEditor = createEditor;
exports.deleteBackward = deleteBackward;
exports.deleteForward = deleteForward;
exports.deleteFragment = deleteFragment;
exports.deleteText = deleteText;
exports.deselect = deselect;
exports.edges = edges;
exports.elementReadOnly = elementReadOnly;
exports.end = end;
exports.first = first;
exports.fragment = fragment;
exports.getDirtyPaths = getDirtyPaths;
exports.getFragment = getFragment;
exports.getVoid = getVoid;
exports.hasBlocks = hasBlocks;
exports.hasInlines = hasInlines;
exports.hasPath = hasPath;
exports.hasTexts = hasTexts;
exports.insertBreak = insertBreak;
exports.insertFragment = insertFragment;
exports.insertNode = insertNode;
exports.insertNodes = insertNodes;
exports.insertSoftBreak = insertSoftBreak;
exports.insertText = insertText;
exports.isBlock = isBlock;
exports.isEdge = isEdge;
exports.isEditor = isEditor;
exports.isEmpty = isEmpty;
exports.isEnd = isEnd;
exports.isNormalizing = isNormalizing;
exports.isStart = isStart;
exports.last = last;
exports.leaf = leaf;
exports.levels = levels;
exports.liftNodes = liftNodes;
exports.marks = marks;
exports.mergeNodes = mergeNodes;
exports.move = move;
exports.moveNodes = moveNodes;
exports.next = next;
exports.node = node;
exports.nodes = nodes;
exports.normalize = normalize;
exports.normalizeNode = normalizeNode;
exports.parent = parent;
exports.path = path;
exports.pathRef = pathRef;
exports.pathRefs = pathRefs;
exports.point = point;
exports.pointRef = pointRef;
exports.pointRefs = pointRefs;
exports.positions = positions;
exports.previous = previous;
exports.range = range;
exports.rangeRef = rangeRef;
exports.rangeRefs = rangeRefs;
exports.removeMark = removeMark;
exports.removeNodes = removeNodes;
exports.select = select;
exports.setNodes = setNodes;
exports.setNormalizing = setNormalizing;
exports.setPoint = setPoint;
exports.setSelection = setSelection;
exports.shouldNormalize = shouldNormalize;
exports.splitNodes = splitNodes;
exports.start = start;
exports.string = string;
exports.unhangRange = unhangRange;
exports.unsetNodes = unsetNodes;
exports.unwrapNodes = unwrapNodes;
exports.withoutNormalizing = withoutNormalizing;
exports.wrapNodes = wrapNodes;
//# sourceMappingURL=index.js.map
