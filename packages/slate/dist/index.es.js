import { isPlainObject } from 'is-plain-object';
import { produce, createDraft, finishDraft, isDraft } from 'immer';

function _defineProperty(obj, key, value) {
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

var DIRTY_PATHS = new WeakMap();
var DIRTY_PATH_KEYS = new WeakMap();
var FLUSHING = new WeakMap();
var NORMALIZING = new WeakMap();
var PATH_REFS = new WeakMap();
var POINT_REFS = new WeakMap();
var RANGE_REFS = new WeakMap();

function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$9(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Create a new Slate `Editor` object.
 */

var createEditor = () => {
  var editor = {
    children: [],
    operations: [],
    selection: null,
    marks: null,
    isInline: () => false,
    isVoid: () => false,
    onChange: () => {},
    apply: op => {
      for (var ref of Editor.pathRefs(editor)) {
        PathRef.transform(ref, op);
      }

      for (var _ref of Editor.pointRefs(editor)) {
        PointRef.transform(_ref, op);
      }

      for (var _ref2 of Editor.rangeRefs(editor)) {
        RangeRef.transform(_ref2, op);
      }

      var oldDirtyPaths = DIRTY_PATHS.get(editor) || [];
      var oldDirtyPathKeys = DIRTY_PATH_KEYS.get(editor) || new Set();
      var dirtyPaths;
      var dirtyPathKeys;

      var add = path => {
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

        for (var path of oldDirtyPaths) {
          var newPath = Path.transform(path, op);
          add(newPath);
        }
      } else {
        dirtyPaths = oldDirtyPaths;
        dirtyPathKeys = oldDirtyPathKeys;
      }

      var newDirtyPaths = getDirtyPaths(op);

      for (var _path of newDirtyPaths) {
        add(_path);
      }

      DIRTY_PATHS.set(editor, dirtyPaths);
      DIRTY_PATH_KEYS.set(editor, dirtyPathKeys);
      Transforms.transform(editor, op);
      editor.operations.push(op);
      Editor.normalize(editor); // Clear any formats applied to the cursor if the selection changes.

      if (op.type === 'set_selection') {
        editor.marks = null;
      }

      if (!FLUSHING.get(editor)) {
        FLUSHING.set(editor, true);
        Promise.resolve().then(() => {
          FLUSHING.set(editor, false);
          editor.onChange();
          editor.operations = [];
        });
      }
    },
    addMark: (key, value) => {
      var {
        selection
      } = editor;

      if (selection) {
        if (Range.isExpanded(selection)) {
          Transforms.setNodes(editor, {
            [key]: value
          }, {
            match: Text.isText,
            split: true
          });
        } else {
          var marks = _objectSpread$9(_objectSpread$9({}, Editor.marks(editor) || {}), {}, {
            [key]: value
          });

          editor.marks = marks;

          if (!FLUSHING.get(editor)) {
            editor.onChange();
          }
        }
      }
    },
    deleteBackward: unit => {
      var {
        selection
      } = editor;

      if (selection && Range.isCollapsed(selection)) {
        Transforms.delete(editor, {
          unit,
          reverse: true
        });
      }
    },
    deleteForward: unit => {
      var {
        selection
      } = editor;

      if (selection && Range.isCollapsed(selection)) {
        Transforms.delete(editor, {
          unit
        });
      }
    },
    deleteFragment: direction => {
      var {
        selection
      } = editor;

      if (selection && Range.isExpanded(selection)) {
        Transforms.delete(editor, {
          reverse: direction === 'backward'
        });
      }
    },
    getFragment: () => {
      var {
        selection
      } = editor;

      if (selection) {
        return Node.fragment(editor, selection);
      }

      return [];
    },
    insertBreak: () => {
      Transforms.splitNodes(editor, {
        always: true
      });
    },
    insertSoftBreak: () => {
      Transforms.splitNodes(editor, {
        always: true
      });
    },
    insertFragment: fragment => {
      Transforms.insertFragment(editor, fragment);
    },
    insertNode: node => {
      Transforms.insertNodes(editor, node);
    },
    insertText: text => {
      var {
        selection,
        marks
      } = editor;

      if (selection) {
        if (marks) {
          var node = _objectSpread$9({
            text
          }, marks);

          Transforms.insertNodes(editor, node);
        } else {
          Transforms.insertText(editor, text);
        }

        editor.marks = null;
      }
    },
    normalizeNode: entry => {
      var [node, path] = entry; // There are no core normalizations for text nodes.

      if (Text.isText(node)) {
        return;
      } // Ensure that block and inline nodes have at least one text child.


      if (Element.isElement(node) && node.children.length === 0) {
        var child = {
          text: ''
        };
        Transforms.insertNodes(editor, child, {
          at: path.concat(0),
          voids: true
        });
        return;
      } // Determine whether the node should have block or inline children.


      var shouldHaveInlines = Editor.isEditor(node) ? false : Element.isElement(node) && (editor.isInline(node) || node.children.length === 0 || Text.isText(node.children[0]) || editor.isInline(node.children[0])); // Since we'll be applying operations while iterating, keep track of an
      // index that accounts for any added/removed nodes.

      var n = 0;

      for (var i = 0; i < node.children.length; i++, n++) {
        var currentNode = Node.get(editor, path);
        if (Text.isText(currentNode)) continue;
        var _child = node.children[i];
        var prev = currentNode.children[n - 1];
        var isLast = i === node.children.length - 1;
        var isInlineOrText = Text.isText(_child) || Element.isElement(_child) && editor.isInline(_child); // Only allow block nodes in the top-level children and parent blocks
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
    },
    removeMark: key => {
      var {
        selection
      } = editor;

      if (selection) {
        if (Range.isExpanded(selection)) {
          Transforms.unsetNodes(editor, key, {
            match: Text.isText,
            split: true
          });
        } else {
          var marks = _objectSpread$9({}, Editor.marks(editor) || {});

          delete marks[key];
          editor.marks = marks;

          if (!FLUSHING.get(editor)) {
            editor.onChange();
          }
        }
      }
    }
  };
  return editor;
};
/**
 * Get the "dirty" paths generated from an operation.
 */

var getDirtyPaths = op => {
  switch (op.type) {
    case 'insert_text':
    case 'remove_text':
    case 'set_node':
      {
        var {
          path
        } = op;
        return Path.levels(path);
      }

    case 'insert_node':
      {
        var {
          node,
          path: _path2
        } = op;
        var levels = Path.levels(_path2);
        var descendants = Text.isText(node) ? [] : Array.from(Node.nodes(node), _ref3 => {
          var [, p] = _ref3;
          return _path2.concat(p);
        });
        return [...levels, ...descendants];
      }

    case 'merge_node':
      {
        var {
          path: _path3
        } = op;
        var ancestors = Path.ancestors(_path3);
        var previousPath = Path.previous(_path3);
        return [...ancestors, previousPath];
      }

    case 'move_node':
      {
        var {
          path: _path4,
          newPath
        } = op;

        if (Path.equals(_path4, newPath)) {
          return [];
        }

        var oldAncestors = [];
        var newAncestors = [];

        for (var ancestor of Path.ancestors(_path4)) {
          var p = Path.transform(ancestor, op);
          oldAncestors.push(p);
        }

        for (var _ancestor of Path.ancestors(newPath)) {
          var _p = Path.transform(_ancestor, op);

          newAncestors.push(_p);
        }

        var newParent = newAncestors[newAncestors.length - 1];
        var newIndex = newPath[newPath.length - 1];
        var resultPath = newParent.concat(newIndex);
        return [...oldAncestors, ...newAncestors, resultPath];
      }

    case 'remove_node':
      {
        var {
          path: _path5
        } = op;

        var _ancestors = Path.ancestors(_path5);

        return [..._ancestors];
      }

    case 'split_node':
      {
        var {
          path: _path6
        } = op;

        var _levels = Path.levels(_path6);

        var nextPath = Path.next(_path6);
        return [..._levels, nextPath];
      }

    default:
      {
        return [];
      }
  }
};

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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
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
  var distance = 0; // Evaluation of these conditions are deferred.

  var gb11 = null; // Is GB11 applicable?

  var gb12Or13 = null; // Is GB12 or GB13 applicable?

  for (var char of codepoints) {
    var code = char.codePointAt(0);
    if (!code) break;
    var type = getCodepointType(char, code);
    [left, right] = isLTR ? [right, type] : [type, left];

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

    distance += char.length;
  }

  return distance || 1;
};
var SPACE = /\s/;
var PUNCTUATION = /[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
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
    var [char, remaining] = splitByCharacterDistance(text, charDist, isRTL);

    if (isWordCharacter(char, remaining, isRTL)) {
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

var splitByCharacterDistance = (str, dist, isRTL) => {
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

var isWordCharacter = function isWordCharacter(char, remaining) {
  var isRTL = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (SPACE.test(char)) {
    return false;
  } // Chameleons count as word characters as long as they're in a word, so
  // recurse to see if the next one is a word character or not.


  if (CHAMELEON.test(char)) {
    var charDist = getCharacterDistance(remaining, isRTL);
    var [nextChar, nextRemaining] = splitByCharacterDistance(remaining, charDist, isRTL);

    if (isWordCharacter(nextChar, nextRemaining, isRTL)) {
      return true;
    }
  }

  if (PUNCTUATION.test(char)) {
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

var isHighSurrogate = charCode => {
  return charCode >= 0xd800 && charCode <= 0xdbff;
};
/**
 * Is `charCode` a low surrogate.
 *
 * https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates
 */


var isLowSurrogate = charCode => {
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

var reExtend = /^(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1AC0\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDF46-\uDF50]|\uD804[\uDC01\uDC38-\uDC46\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD30-\uDD36\uDEEC-\uDEEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])$/;
var rePrepend = /^(?:[\u0600-\u0605\u06DD\u070F\u0890\u0891\u08E2\u0D4E]|\uD804[\uDCBD\uDCCD\uDDC2\uDDC3]|\uD806[\uDD3F\uDD41\uDE3A\uDE84-\uDE89]|\uD807\uDD46)$/;
var reSpacingMark = /^(?:[\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BF\u09C0\u09C7\u09C8\u09CB\u09CC\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0\u0CC1\u0CC3\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0D02\u0D03\u0D3F\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D82\u0D83\u0DD0\u0DD1\u0DD8-\u0DDE\u0DF2\u0DF3\u0E33\u0EB3\u0F3E\u0F3F\u0F7F\u1031\u103B\u103C\u1056\u1057\u1084\u1715\u1734\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A6D-\u1A72\u1B04\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF7\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC]|\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD45\uDD46\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDDCE\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF62\uDF63]|\uD805[\uDC35-\uDC37\uDC40\uDC41\uDC45\uDCB1\uDCB2\uDCB9\uDCBB\uDCBC\uDCBE\uDCC1\uDDB0\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF26]|\uD806[\uDC2C-\uDC2E\uDC38\uDD31-\uDD35\uDD37\uDD38\uDD3D\uDD40\uDD42\uDDD1-\uDDD3\uDDDC-\uDDDF\uDDE4\uDE39\uDE57\uDE58\uDE97]|\uD807[\uDC2F\uDC3E\uDCA9\uDCB1\uDCB4\uDD8A-\uDD8E\uDD93\uDD94\uDD96\uDEF5\uDEF6]|\uD81B[\uDF51-\uDF87\uDFF0\uDFF1]|\uD834[\uDD66\uDD6D])$/;
var reL = /^[\u1100-\u115F\uA960-\uA97C]$/;
var reV = /^[\u1160-\u11A7\uD7B0-\uD7C6]$/;
var reT = /^[\u11A8-\u11FF\uD7CB-\uD7FB]$/;
var reLV = /^[\uAC00\uAC1C\uAC38\uAC54\uAC70\uAC8C\uACA8\uACC4\uACE0\uACFC\uAD18\uAD34\uAD50\uAD6C\uAD88\uADA4\uADC0\uADDC\uADF8\uAE14\uAE30\uAE4C\uAE68\uAE84\uAEA0\uAEBC\uAED8\uAEF4\uAF10\uAF2C\uAF48\uAF64\uAF80\uAF9C\uAFB8\uAFD4\uAFF0\uB00C\uB028\uB044\uB060\uB07C\uB098\uB0B4\uB0D0\uB0EC\uB108\uB124\uB140\uB15C\uB178\uB194\uB1B0\uB1CC\uB1E8\uB204\uB220\uB23C\uB258\uB274\uB290\uB2AC\uB2C8\uB2E4\uB300\uB31C\uB338\uB354\uB370\uB38C\uB3A8\uB3C4\uB3E0\uB3FC\uB418\uB434\uB450\uB46C\uB488\uB4A4\uB4C0\uB4DC\uB4F8\uB514\uB530\uB54C\uB568\uB584\uB5A0\uB5BC\uB5D8\uB5F4\uB610\uB62C\uB648\uB664\uB680\uB69C\uB6B8\uB6D4\uB6F0\uB70C\uB728\uB744\uB760\uB77C\uB798\uB7B4\uB7D0\uB7EC\uB808\uB824\uB840\uB85C\uB878\uB894\uB8B0\uB8CC\uB8E8\uB904\uB920\uB93C\uB958\uB974\uB990\uB9AC\uB9C8\uB9E4\uBA00\uBA1C\uBA38\uBA54\uBA70\uBA8C\uBAA8\uBAC4\uBAE0\uBAFC\uBB18\uBB34\uBB50\uBB6C\uBB88\uBBA4\uBBC0\uBBDC\uBBF8\uBC14\uBC30\uBC4C\uBC68\uBC84\uBCA0\uBCBC\uBCD8\uBCF4\uBD10\uBD2C\uBD48\uBD64\uBD80\uBD9C\uBDB8\uBDD4\uBDF0\uBE0C\uBE28\uBE44\uBE60\uBE7C\uBE98\uBEB4\uBED0\uBEEC\uBF08\uBF24\uBF40\uBF5C\uBF78\uBF94\uBFB0\uBFCC\uBFE8\uC004\uC020\uC03C\uC058\uC074\uC090\uC0AC\uC0C8\uC0E4\uC100\uC11C\uC138\uC154\uC170\uC18C\uC1A8\uC1C4\uC1E0\uC1FC\uC218\uC234\uC250\uC26C\uC288\uC2A4\uC2C0\uC2DC\uC2F8\uC314\uC330\uC34C\uC368\uC384\uC3A0\uC3BC\uC3D8\uC3F4\uC410\uC42C\uC448\uC464\uC480\uC49C\uC4B8\uC4D4\uC4F0\uC50C\uC528\uC544\uC560\uC57C\uC598\uC5B4\uC5D0\uC5EC\uC608\uC624\uC640\uC65C\uC678\uC694\uC6B0\uC6CC\uC6E8\uC704\uC720\uC73C\uC758\uC774\uC790\uC7AC\uC7C8\uC7E4\uC800\uC81C\uC838\uC854\uC870\uC88C\uC8A8\uC8C4\uC8E0\uC8FC\uC918\uC934\uC950\uC96C\uC988\uC9A4\uC9C0\uC9DC\uC9F8\uCA14\uCA30\uCA4C\uCA68\uCA84\uCAA0\uCABC\uCAD8\uCAF4\uCB10\uCB2C\uCB48\uCB64\uCB80\uCB9C\uCBB8\uCBD4\uCBF0\uCC0C\uCC28\uCC44\uCC60\uCC7C\uCC98\uCCB4\uCCD0\uCCEC\uCD08\uCD24\uCD40\uCD5C\uCD78\uCD94\uCDB0\uCDCC\uCDE8\uCE04\uCE20\uCE3C\uCE58\uCE74\uCE90\uCEAC\uCEC8\uCEE4\uCF00\uCF1C\uCF38\uCF54\uCF70\uCF8C\uCFA8\uCFC4\uCFE0\uCFFC\uD018\uD034\uD050\uD06C\uD088\uD0A4\uD0C0\uD0DC\uD0F8\uD114\uD130\uD14C\uD168\uD184\uD1A0\uD1BC\uD1D8\uD1F4\uD210\uD22C\uD248\uD264\uD280\uD29C\uD2B8\uD2D4\uD2F0\uD30C\uD328\uD344\uD360\uD37C\uD398\uD3B4\uD3D0\uD3EC\uD408\uD424\uD440\uD45C\uD478\uD494\uD4B0\uD4CC\uD4E8\uD504\uD520\uD53C\uD558\uD574\uD590\uD5AC\uD5C8\uD5E4\uD600\uD61C\uD638\uD654\uD670\uD68C\uD6A8\uD6C4\uD6E0\uD6FC\uD718\uD734\uD750\uD76C\uD788]$/;
var reLVT = /^[\uAC01-\uAC1B\uAC1D-\uAC37\uAC39-\uAC53\uAC55-\uAC6F\uAC71-\uAC8B\uAC8D-\uACA7\uACA9-\uACC3\uACC5-\uACDF\uACE1-\uACFB\uACFD-\uAD17\uAD19-\uAD33\uAD35-\uAD4F\uAD51-\uAD6B\uAD6D-\uAD87\uAD89-\uADA3\uADA5-\uADBF\uADC1-\uADDB\uADDD-\uADF7\uADF9-\uAE13\uAE15-\uAE2F\uAE31-\uAE4B\uAE4D-\uAE67\uAE69-\uAE83\uAE85-\uAE9F\uAEA1-\uAEBB\uAEBD-\uAED7\uAED9-\uAEF3\uAEF5-\uAF0F\uAF11-\uAF2B\uAF2D-\uAF47\uAF49-\uAF63\uAF65-\uAF7F\uAF81-\uAF9B\uAF9D-\uAFB7\uAFB9-\uAFD3\uAFD5-\uAFEF\uAFF1-\uB00B\uB00D-\uB027\uB029-\uB043\uB045-\uB05F\uB061-\uB07B\uB07D-\uB097\uB099-\uB0B3\uB0B5-\uB0CF\uB0D1-\uB0EB\uB0ED-\uB107\uB109-\uB123\uB125-\uB13F\uB141-\uB15B\uB15D-\uB177\uB179-\uB193\uB195-\uB1AF\uB1B1-\uB1CB\uB1CD-\uB1E7\uB1E9-\uB203\uB205-\uB21F\uB221-\uB23B\uB23D-\uB257\uB259-\uB273\uB275-\uB28F\uB291-\uB2AB\uB2AD-\uB2C7\uB2C9-\uB2E3\uB2E5-\uB2FF\uB301-\uB31B\uB31D-\uB337\uB339-\uB353\uB355-\uB36F\uB371-\uB38B\uB38D-\uB3A7\uB3A9-\uB3C3\uB3C5-\uB3DF\uB3E1-\uB3FB\uB3FD-\uB417\uB419-\uB433\uB435-\uB44F\uB451-\uB46B\uB46D-\uB487\uB489-\uB4A3\uB4A5-\uB4BF\uB4C1-\uB4DB\uB4DD-\uB4F7\uB4F9-\uB513\uB515-\uB52F\uB531-\uB54B\uB54D-\uB567\uB569-\uB583\uB585-\uB59F\uB5A1-\uB5BB\uB5BD-\uB5D7\uB5D9-\uB5F3\uB5F5-\uB60F\uB611-\uB62B\uB62D-\uB647\uB649-\uB663\uB665-\uB67F\uB681-\uB69B\uB69D-\uB6B7\uB6B9-\uB6D3\uB6D5-\uB6EF\uB6F1-\uB70B\uB70D-\uB727\uB729-\uB743\uB745-\uB75F\uB761-\uB77B\uB77D-\uB797\uB799-\uB7B3\uB7B5-\uB7CF\uB7D1-\uB7EB\uB7ED-\uB807\uB809-\uB823\uB825-\uB83F\uB841-\uB85B\uB85D-\uB877\uB879-\uB893\uB895-\uB8AF\uB8B1-\uB8CB\uB8CD-\uB8E7\uB8E9-\uB903\uB905-\uB91F\uB921-\uB93B\uB93D-\uB957\uB959-\uB973\uB975-\uB98F\uB991-\uB9AB\uB9AD-\uB9C7\uB9C9-\uB9E3\uB9E5-\uB9FF\uBA01-\uBA1B\uBA1D-\uBA37\uBA39-\uBA53\uBA55-\uBA6F\uBA71-\uBA8B\uBA8D-\uBAA7\uBAA9-\uBAC3\uBAC5-\uBADF\uBAE1-\uBAFB\uBAFD-\uBB17\uBB19-\uBB33\uBB35-\uBB4F\uBB51-\uBB6B\uBB6D-\uBB87\uBB89-\uBBA3\uBBA5-\uBBBF\uBBC1-\uBBDB\uBBDD-\uBBF7\uBBF9-\uBC13\uBC15-\uBC2F\uBC31-\uBC4B\uBC4D-\uBC67\uBC69-\uBC83\uBC85-\uBC9F\uBCA1-\uBCBB\uBCBD-\uBCD7\uBCD9-\uBCF3\uBCF5-\uBD0F\uBD11-\uBD2B\uBD2D-\uBD47\uBD49-\uBD63\uBD65-\uBD7F\uBD81-\uBD9B\uBD9D-\uBDB7\uBDB9-\uBDD3\uBDD5-\uBDEF\uBDF1-\uBE0B\uBE0D-\uBE27\uBE29-\uBE43\uBE45-\uBE5F\uBE61-\uBE7B\uBE7D-\uBE97\uBE99-\uBEB3\uBEB5-\uBECF\uBED1-\uBEEB\uBEED-\uBF07\uBF09-\uBF23\uBF25-\uBF3F\uBF41-\uBF5B\uBF5D-\uBF77\uBF79-\uBF93\uBF95-\uBFAF\uBFB1-\uBFCB\uBFCD-\uBFE7\uBFE9-\uC003\uC005-\uC01F\uC021-\uC03B\uC03D-\uC057\uC059-\uC073\uC075-\uC08F\uC091-\uC0AB\uC0AD-\uC0C7\uC0C9-\uC0E3\uC0E5-\uC0FF\uC101-\uC11B\uC11D-\uC137\uC139-\uC153\uC155-\uC16F\uC171-\uC18B\uC18D-\uC1A7\uC1A9-\uC1C3\uC1C5-\uC1DF\uC1E1-\uC1FB\uC1FD-\uC217\uC219-\uC233\uC235-\uC24F\uC251-\uC26B\uC26D-\uC287\uC289-\uC2A3\uC2A5-\uC2BF\uC2C1-\uC2DB\uC2DD-\uC2F7\uC2F9-\uC313\uC315-\uC32F\uC331-\uC34B\uC34D-\uC367\uC369-\uC383\uC385-\uC39F\uC3A1-\uC3BB\uC3BD-\uC3D7\uC3D9-\uC3F3\uC3F5-\uC40F\uC411-\uC42B\uC42D-\uC447\uC449-\uC463\uC465-\uC47F\uC481-\uC49B\uC49D-\uC4B7\uC4B9-\uC4D3\uC4D5-\uC4EF\uC4F1-\uC50B\uC50D-\uC527\uC529-\uC543\uC545-\uC55F\uC561-\uC57B\uC57D-\uC597\uC599-\uC5B3\uC5B5-\uC5CF\uC5D1-\uC5EB\uC5ED-\uC607\uC609-\uC623\uC625-\uC63F\uC641-\uC65B\uC65D-\uC677\uC679-\uC693\uC695-\uC6AF\uC6B1-\uC6CB\uC6CD-\uC6E7\uC6E9-\uC703\uC705-\uC71F\uC721-\uC73B\uC73D-\uC757\uC759-\uC773\uC775-\uC78F\uC791-\uC7AB\uC7AD-\uC7C7\uC7C9-\uC7E3\uC7E5-\uC7FF\uC801-\uC81B\uC81D-\uC837\uC839-\uC853\uC855-\uC86F\uC871-\uC88B\uC88D-\uC8A7\uC8A9-\uC8C3\uC8C5-\uC8DF\uC8E1-\uC8FB\uC8FD-\uC917\uC919-\uC933\uC935-\uC94F\uC951-\uC96B\uC96D-\uC987\uC989-\uC9A3\uC9A5-\uC9BF\uC9C1-\uC9DB\uC9DD-\uC9F7\uC9F9-\uCA13\uCA15-\uCA2F\uCA31-\uCA4B\uCA4D-\uCA67\uCA69-\uCA83\uCA85-\uCA9F\uCAA1-\uCABB\uCABD-\uCAD7\uCAD9-\uCAF3\uCAF5-\uCB0F\uCB11-\uCB2B\uCB2D-\uCB47\uCB49-\uCB63\uCB65-\uCB7F\uCB81-\uCB9B\uCB9D-\uCBB7\uCBB9-\uCBD3\uCBD5-\uCBEF\uCBF1-\uCC0B\uCC0D-\uCC27\uCC29-\uCC43\uCC45-\uCC5F\uCC61-\uCC7B\uCC7D-\uCC97\uCC99-\uCCB3\uCCB5-\uCCCF\uCCD1-\uCCEB\uCCED-\uCD07\uCD09-\uCD23\uCD25-\uCD3F\uCD41-\uCD5B\uCD5D-\uCD77\uCD79-\uCD93\uCD95-\uCDAF\uCDB1-\uCDCB\uCDCD-\uCDE7\uCDE9-\uCE03\uCE05-\uCE1F\uCE21-\uCE3B\uCE3D-\uCE57\uCE59-\uCE73\uCE75-\uCE8F\uCE91-\uCEAB\uCEAD-\uCEC7\uCEC9-\uCEE3\uCEE5-\uCEFF\uCF01-\uCF1B\uCF1D-\uCF37\uCF39-\uCF53\uCF55-\uCF6F\uCF71-\uCF8B\uCF8D-\uCFA7\uCFA9-\uCFC3\uCFC5-\uCFDF\uCFE1-\uCFFB\uCFFD-\uD017\uD019-\uD033\uD035-\uD04F\uD051-\uD06B\uD06D-\uD087\uD089-\uD0A3\uD0A5-\uD0BF\uD0C1-\uD0DB\uD0DD-\uD0F7\uD0F9-\uD113\uD115-\uD12F\uD131-\uD14B\uD14D-\uD167\uD169-\uD183\uD185-\uD19F\uD1A1-\uD1BB\uD1BD-\uD1D7\uD1D9-\uD1F3\uD1F5-\uD20F\uD211-\uD22B\uD22D-\uD247\uD249-\uD263\uD265-\uD27F\uD281-\uD29B\uD29D-\uD2B7\uD2B9-\uD2D3\uD2D5-\uD2EF\uD2F1-\uD30B\uD30D-\uD327\uD329-\uD343\uD345-\uD35F\uD361-\uD37B\uD37D-\uD397\uD399-\uD3B3\uD3B5-\uD3CF\uD3D1-\uD3EB\uD3ED-\uD407\uD409-\uD423\uD425-\uD43F\uD441-\uD45B\uD45D-\uD477\uD479-\uD493\uD495-\uD4AF\uD4B1-\uD4CB\uD4CD-\uD4E7\uD4E9-\uD503\uD505-\uD51F\uD521-\uD53B\uD53D-\uD557\uD559-\uD573\uD575-\uD58F\uD591-\uD5AB\uD5AD-\uD5C7\uD5C9-\uD5E3\uD5E5-\uD5FF\uD601-\uD61B\uD61D-\uD637\uD639-\uD653\uD655-\uD66F\uD671-\uD68B\uD68D-\uD6A7\uD6A9-\uD6C3\uD6C5-\uD6DF\uD6E1-\uD6FB\uD6FD-\uD717\uD719-\uD733\uD735-\uD74F\uD751-\uD76B\uD76D-\uD787\uD789-\uD7A3]$/;
var reExtPict = /^(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])$/;

var getCodepointType = (char, code) => {
  var type = CodepointType.Any;

  if (char.search(reExtend) !== -1) {
    type |= CodepointType.Extend;
  }

  if (code === 0x200d) {
    type |= CodepointType.ZWJ;
  }

  if (code >= 0x1f1e6 && code <= 0x1f1ff) {
    type |= CodepointType.RI;
  }

  if (char.search(rePrepend) !== -1) {
    type |= CodepointType.Prepend;
  }

  if (char.search(reSpacingMark) !== -1) {
    type |= CodepointType.SpacingMark;
  }

  if (char.search(reL) !== -1) {
    type |= CodepointType.L;
  }

  if (char.search(reV) !== -1) {
    type |= CodepointType.V;
  }

  if (char.search(reT) !== -1) {
    type |= CodepointType.T;
  }

  if (char.search(reLV) !== -1) {
    type |= CodepointType.LV;
  }

  if (char.search(reLVT) !== -1) {
    type |= CodepointType.LVT;
  }

  if (char.search(reExtPict) !== -1) {
    type |= CodepointType.ExtPict;
  }

  return type;
};

function intersects(x, y) {
  return (x & y) !== 0;
}

var NonBoundaryPairs = [// GB6
[CodepointType.L, CodepointType.L | CodepointType.V | CodepointType.LV | CodepointType.LVT], // GB7
[CodepointType.LV | CodepointType.V, CodepointType.V | CodepointType.T], // GB8
[CodepointType.LVT | CodepointType.T, CodepointType.T], // GB9
[CodepointType.Any, CodepointType.Extend | CodepointType.ZWJ], // GB9a
[CodepointType.Any, CodepointType.SpacingMark], // GB9b
[CodepointType.Prepend, CodepointType.Any], // GB11
[CodepointType.ZWJ, CodepointType.ExtPict], // GB12 and GB13
[CodepointType.RI, CodepointType.RI]];

function isBoundaryPair(left, right) {
  return NonBoundaryPairs.findIndex(r => intersects(left, r[0]) && intersects(right, r[1])) === -1;
}

var endingEmojiZWJ = /(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u2388\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u2690-\u2705\u2708-\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2767\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDD0F\uDD2F\uDD6C-\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDAD-\uDDE5\uDE01-\uDE0F\uDE1A\uDE2F\uDE32-\uDE3A\uDE3C-\uDE3F\uDE49-\uDFFA]|\uD83D[\uDC00-\uDD3D\uDD46-\uDE4F\uDE80-\uDEFF\uDF74-\uDF7F\uDFD5-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDEFF]|\uD83F[\uDC00-\uDFFD])(?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09BE\u09C1-\u09C4\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3E\u0B3F\u0B41-\u0B44\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE\u0BC0\u0BCD\u0BD7\u0C00\u0C04\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC2\u0CC6\u0CCC\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D3E\u0D41-\u0D44\u0D4D\u0D57\u0D62\u0D63\u0D81\u0DCA\u0DCF\u0DD2-\u0DD4\u0DD6\u0DDF\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1AC0\u1B00-\u1B03\u1B34-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u200C\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFF9E\uFF9F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDF46-\uDF50]|\uD804[\uDC01\uDC38-\uDC46\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF3E\uDF40\uDF57\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB0\uDCB3-\uDCB8\uDCBA\uDCBD\uDCBF\uDCC0\uDCC2\uDCC3\uDDAF\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD30\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65\uDD67-\uDD69\uDD6E-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD30-\uDD36\uDEEC-\uDEEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uD83C[\uDFFB-\uDFFF]|\uDB40[\uDC20-\uDC7F\uDD00-\uDDEF])*\u200D$/;

var endsWithEmojiZWJ = str => {
  return str.search(endingEmojiZWJ) !== -1;
};

var endingRIs = /(?:\uD83C[\uDDE6-\uDDFF])+$/g;

var endsWithOddNumberOfRIs = str => {
  var match = str.match(endingRIs);

  if (match === null) {
    return false;
  } else {
    // A RI is represented by a surrogate pair.
    var numRIs = match[0].length / 2;
    return numRIs % 2 === 1;
  }
};

/**
 * Shared the function with isElementType utility
 */

var isElement = value => {
  return isPlainObject(value) && Node.isNodeList(value.children) && !Editor.isEditor(value);
};

var Element = {
  /**
   * Check if a value implements the 'Ancestor' interface.
   */
  isAncestor(value) {
    return isPlainObject(value) && Node.isNodeList(value.children);
  },

  /**
   * Check if a value implements the `Element` interface.
   */
  isElement,

  /**
   * Check if a value is an array of `Element` objects.
   */
  isElementList(value) {
    return Array.isArray(value) && value.every(val => Element.isElement(val));
  },

  /**
   * Check if a set of props is a partial of Element.
   */
  isElementProps(props) {
    return props.children !== undefined;
  },

  /**
   * Check if a value implements the `Element` interface and has elementKey with selected value.
   * Default it check to `type` key value
   */
  isElementType: function isElementType(value, elementVal) {
    var elementKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'type';
    return isElement(value) && value[elementKey] === elementVal;
  },

  /**
   * Check if an element matches set of properties.
   *
   * Note: this checks custom properties, and it does not ensure that any
   * children are equivalent.
   */
  matches(element, props) {
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

var _excluded$4 = ["text"],
    _excluded2$3 = ["text"];

function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var IS_EDITOR_CACHE = new WeakMap();
var Editor = {
  /**
   * Get the ancestor above a location in the document.
   */
  above(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      voids = false,
      mode = 'lowest',
      at = editor.selection,
      match
    } = options;

    if (!at) {
      return;
    }

    var path = Editor.path(editor, at);
    var reverse = mode === 'lowest';

    for (var [n, p] of Editor.levels(editor, {
      at: path,
      voids,
      match,
      reverse
    })) {
      if (!Text.isText(n) && !Path.equals(path, p)) {
        return [n, p];
      }
    }
  },

  /**
   * Add a custom property to the leaf text nodes in the current selection.
   *
   * If the selection is currently collapsed, the marks will be added to the
   * `editor.marks` property instead, and applied when text is inserted next.
   */
  addMark(editor, key, value) {
    editor.addMark(key, value);
  },

  /**
   * Get the point after a location.
   */
  after(editor, at) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var anchor = Editor.point(editor, at, {
      edge: 'end'
    });
    var focus = Editor.end(editor, []);
    var range = {
      anchor,
      focus
    };
    var {
      distance = 1
    } = options;
    var d = 0;
    var target;

    for (var p of Editor.positions(editor, _objectSpread$8(_objectSpread$8({}, options), {}, {
      at: range
    }))) {
      if (d > distance) {
        break;
      }

      if (d !== 0) {
        target = p;
      }

      d++;
    }

    return target;
  },

  /**
   * Get the point before a location.
   */
  before(editor, at) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var anchor = Editor.start(editor, []);
    var focus = Editor.point(editor, at, {
      edge: 'start'
    });
    var range = {
      anchor,
      focus
    };
    var {
      distance = 1
    } = options;
    var d = 0;
    var target;

    for (var p of Editor.positions(editor, _objectSpread$8(_objectSpread$8({}, options), {}, {
      at: range,
      reverse: true
    }))) {
      if (d > distance) {
        break;
      }

      if (d !== 0) {
        target = p;
      }

      d++;
    }

    return target;
  },

  /**
   * Delete content in the editor backward from the current selection.
   */
  deleteBackward(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      unit = 'character'
    } = options;
    editor.deleteBackward(unit);
  },

  /**
   * Delete content in the editor forward from the current selection.
   */
  deleteForward(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      unit = 'character'
    } = options;
    editor.deleteForward(unit);
  },

  /**
   * Delete the content in the current selection.
   */
  deleteFragment(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      direction = 'forward'
    } = options;
    editor.deleteFragment(direction);
  },

  /**
   * Get the start and end points of a location.
   */
  edges(editor, at) {
    return [Editor.start(editor, at), Editor.end(editor, at)];
  },

  /**
   * Get the end point of a location.
   */
  end(editor, at) {
    return Editor.point(editor, at, {
      edge: 'end'
    });
  },

  /**
   * Get the first node at a location.
   */
  first(editor, at) {
    var path = Editor.path(editor, at, {
      edge: 'start'
    });
    return Editor.node(editor, path);
  },

  /**
   * Get the fragment at a location.
   */
  fragment(editor, at) {
    var range = Editor.range(editor, at);
    var fragment = Node.fragment(editor, range);
    return fragment;
  },

  /**
   * Check if a node has block children.
   */
  hasBlocks(editor, element) {
    return element.children.some(n => Editor.isBlock(editor, n));
  },

  /**
   * Check if a node has inline and text children.
   */
  hasInlines(editor, element) {
    return element.children.some(n => Text.isText(n) || Editor.isInline(editor, n));
  },

  /**
   * Check if a node has text children.
   */
  hasTexts(editor, element) {
    return element.children.every(n => Text.isText(n));
  },

  /**
   * Insert a block break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */
  insertBreak(editor) {
    editor.insertBreak();
  },

  /**
   * Insert a soft break at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */
  insertSoftBreak(editor) {
    editor.insertSoftBreak();
  },

  /**
   * Insert a fragment at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */
  insertFragment(editor, fragment) {
    editor.insertFragment(fragment);
  },

  /**
   * Insert a node at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */
  insertNode(editor, node) {
    editor.insertNode(node);
  },

  /**
   * Insert text at the current selection.
   *
   * If the selection is currently expanded, it will be deleted first.
   */
  insertText(editor, text) {
    editor.insertText(text);
  },

  /**
   * Check if a value is a block `Element` object.
   */
  isBlock(editor, value) {
    return Element.isElement(value) && !editor.isInline(value);
  },

  /**
   * Check if a value is an `Editor` object.
   */
  isEditor(value) {
    if (!isPlainObject(value)) return false;
    var cachedIsEditor = IS_EDITOR_CACHE.get(value);

    if (cachedIsEditor !== undefined) {
      return cachedIsEditor;
    }

    var isEditor = typeof value.addMark === 'function' && typeof value.apply === 'function' && typeof value.deleteBackward === 'function' && typeof value.deleteForward === 'function' && typeof value.deleteFragment === 'function' && typeof value.insertBreak === 'function' && typeof value.insertSoftBreak === 'function' && typeof value.insertFragment === 'function' && typeof value.insertNode === 'function' && typeof value.insertText === 'function' && typeof value.isInline === 'function' && typeof value.isVoid === 'function' && typeof value.normalizeNode === 'function' && typeof value.onChange === 'function' && typeof value.removeMark === 'function' && (value.marks === null || isPlainObject(value.marks)) && (value.selection === null || Range.isRange(value.selection)) && Node.isNodeList(value.children) && Operation.isOperationList(value.operations);
    IS_EDITOR_CACHE.set(value, isEditor);
    return isEditor;
  },

  /**
   * Check if a point is the end point of a location.
   */
  isEnd(editor, point, at) {
    var end = Editor.end(editor, at);
    return Point.equals(point, end);
  },

  /**
   * Check if a point is an edge of a location.
   */
  isEdge(editor, point, at) {
    return Editor.isStart(editor, point, at) || Editor.isEnd(editor, point, at);
  },

  /**
   * Check if an element is empty, accounting for void nodes.
   */
  isEmpty(editor, element) {
    var {
      children
    } = element;
    var [first] = children;
    return children.length === 0 || children.length === 1 && Text.isText(first) && first.text === '' && !editor.isVoid(element);
  },

  /**
   * Check if a value is an inline `Element` object.
   */
  isInline(editor, value) {
    return Element.isElement(value) && editor.isInline(value);
  },

  /**
   * Check if the editor is currently normalizing after each operation.
   */
  isNormalizing(editor) {
    var isNormalizing = NORMALIZING.get(editor);
    return isNormalizing === undefined ? true : isNormalizing;
  },

  /**
   * Check if a point is the start point of a location.
   */
  isStart(editor, point, at) {
    // PERF: If the offset isn't `0` we know it's not the start.
    if (point.offset !== 0) {
      return false;
    }

    var start = Editor.start(editor, at);
    return Point.equals(point, start);
  },

  /**
   * Check if a value is a void `Element` object.
   */
  isVoid(editor, value) {
    return Element.isElement(value) && editor.isVoid(value);
  },

  /**
   * Get the last node at a location.
   */
  last(editor, at) {
    var path = Editor.path(editor, at, {
      edge: 'end'
    });
    return Editor.node(editor, path);
  },

  /**
   * Get the leaf text node at a location.
   */
  leaf(editor, at) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var path = Editor.path(editor, at, options);
    var node = Node.leaf(editor, path);
    return [node, path];
  },

  /**
   * Iterate through all of the levels at a location.
   */
  *levels(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      at = editor.selection,
      reverse = false,
      voids = false
    } = options;
    var {
      match
    } = options;

    if (match == null) {
      match = () => true;
    }

    if (!at) {
      return;
    }

    var levels = [];
    var path = Editor.path(editor, at);

    for (var [n, p] of Node.levels(editor, path)) {
      if (!match(n, p)) {
        continue;
      }

      levels.push([n, p]);

      if (!voids && Editor.isVoid(editor, n)) {
        break;
      }
    }

    if (reverse) {
      levels.reverse();
    }

    yield* levels;
  },

  /**
   * Get the marks that would be added to text at the current selection.
   */
  marks(editor) {
    var {
      marks,
      selection
    } = editor;

    if (!selection) {
      return null;
    }

    if (marks) {
      return marks;
    }

    if (Range.isExpanded(selection)) {
      var [match] = Editor.nodes(editor, {
        match: Text.isText
      });

      if (match) {
        var [_node] = match;

        var _rest = _objectWithoutProperties(_node, _excluded$4);

        return _rest;
      } else {
        return {};
      }
    }

    var {
      anchor
    } = selection;
    var {
      path
    } = anchor;
    var [node] = Editor.leaf(editor, path);

    if (anchor.offset === 0) {
      var prev = Editor.previous(editor, {
        at: path,
        match: Text.isText
      });
      var block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n)
      });

      if (prev && block) {
        var [prevNode, prevPath] = prev;
        var [, blockPath] = block;

        if (Path.isAncestor(blockPath, prevPath)) {
          node = prevNode;
        }
      }
    }

    var rest = _objectWithoutProperties(node, _excluded2$3);

    return rest;
  },

  /**
   * Get the matching node in the branch of the document after a location.
   */
  next(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      mode = 'lowest',
      voids = false
    } = options;
    var {
      match,
      at = editor.selection
    } = options;

    if (!at) {
      return;
    }

    var pointAfterLocation = Editor.after(editor, at, {
      voids
    });
    if (!pointAfterLocation) return;
    var [, to] = Editor.last(editor, []);
    var span = [pointAfterLocation.path, to];

    if (Path.isPath(at) && at.length === 0) {
      throw new Error("Cannot get the next node from the root node!");
    }

    if (match == null) {
      if (Path.isPath(at)) {
        var [parent] = Editor.parent(editor, at);

        match = n => parent.children.includes(n);
      } else {
        match = () => true;
      }
    }

    var [next] = Editor.nodes(editor, {
      at: span,
      match,
      mode,
      voids
    });
    return next;
  },

  /**
   * Get the node at a location.
   */
  node(editor, at) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var path = Editor.path(editor, at, options);
    var node = Node.get(editor, path);
    return [node, path];
  },

  /**
   * Iterate through all of the nodes in the Editor.
   */
  *nodes(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      at = editor.selection,
      mode = 'all',
      universal = false,
      reverse = false,
      voids = false
    } = options;
    var {
      match
    } = options;

    if (!match) {
      match = () => true;
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
      reverse,
      from,
      to,
      pass: _ref => {
        var [n] = _ref;
        return voids ? false : Editor.isVoid(editor, n);
      }
    });
    var matches = [];
    var hit;

    for (var [node, path] of nodeEntries) {
      var isLower = hit && Path.compare(path, hit[1]) === 0; // In highest mode any node lower than the last hit is not a match.

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
      } // If there's a match and it's lower than the last, update the hit.


      if (mode === 'lowest' && isLower) {
        hit = [node, path];
        continue;
      } // In lowest mode we emit the last hit, once it's guaranteed lowest.


      var emit = mode === 'lowest' ? hit : [node, path];

      if (emit) {
        if (universal) {
          matches.push(emit);
        } else {
          yield emit;
        }
      }

      hit = [node, path];
    } // Since lowest is always emitting one behind, catch up at the end.


    if (mode === 'lowest' && hit) {
      if (universal) {
        matches.push(hit);
      } else {
        yield hit;
      }
    } // Universal defers to ensure that the match occurs in every branch, so we
    // yield all of the matches after iterating.


    if (universal) {
      yield* matches;
    }
  },

  /**
   * Normalize any dirty objects in the editor.
   */
  normalize(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      force = false
    } = options;

    var getDirtyPaths = editor => {
      return DIRTY_PATHS.get(editor) || [];
    };

    var getDirtyPathKeys = editor => {
      return DIRTY_PATH_KEYS.get(editor) || new Set();
    };

    var popDirtyPath = editor => {
      var path = getDirtyPaths(editor).pop();
      var key = path.join(',');
      getDirtyPathKeys(editor).delete(key);
      return path;
    };

    if (!Editor.isNormalizing(editor)) {
      return;
    }

    if (force) {
      var allPaths = Array.from(Node.nodes(editor), _ref2 => {
        var [, p] = _ref2;
        return p;
      });
      var allPathKeys = new Set(allPaths.map(p => p.join(',')));
      DIRTY_PATHS.set(editor, allPaths);
      DIRTY_PATH_KEYS.set(editor, allPathKeys);
    }

    if (getDirtyPaths(editor).length === 0) {
      return;
    }

    Editor.withoutNormalizing(editor, () => {
      /*
        Fix dirty elements with no children.
        editor.normalizeNode() does fix this, but some normalization fixes also require it to work.
        Running an initial pass avoids the catch-22 race condition.
      */
      for (var dirtyPath of getDirtyPaths(editor)) {
        if (Node.has(editor, dirtyPath)) {
          var entry = Editor.node(editor, dirtyPath);
          var [node, _] = entry;
          /*
            The default normalizer inserts an empty text node in this scenario, but it can be customised.
            So there is some risk here.
                       As long as the normalizer only inserts child nodes for this case it is safe to do in any order;
            by definition adding children to an empty node can't cause other paths to change.
          */

          if (Element.isElement(node) && node.children.length === 0) {
            editor.normalizeNode(entry);
          }
        }
      }

      var max = getDirtyPaths(editor).length * 42; // HACK: better way?

      var m = 0;

      while (getDirtyPaths(editor).length !== 0) {
        if (m > max) {
          throw new Error("\n            Could not completely normalize the editor after ".concat(max, " iterations! This is usually due to incorrect normalization logic that leaves a node in an invalid state.\n          "));
        }

        var _dirtyPath = popDirtyPath(editor); // If the node doesn't exist in the tree, it does not need to be normalized.


        if (Node.has(editor, _dirtyPath)) {
          var _entry = Editor.node(editor, _dirtyPath);

          editor.normalizeNode(_entry);
        }

        m++;
      }
    });
  },

  /**
   * Get the parent node of a location.
   */
  parent(editor, at) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var path = Editor.path(editor, at, options);
    var parentPath = Path.parent(path);
    var entry = Editor.node(editor, parentPath);
    return entry;
  },

  /**
   * Get the path of a location.
   */
  path(editor, at) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      depth,
      edge
    } = options;

    if (Path.isPath(at)) {
      if (edge === 'start') {
        var [, firstPath] = Node.first(editor, at);
        at = firstPath;
      } else if (edge === 'end') {
        var [, lastPath] = Node.last(editor, at);
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
  },

  hasPath(editor, path) {
    return Node.has(editor, path);
  },

  /**
   * Create a mutable ref for a `Path` object, which will stay in sync as new
   * operations are applied to the editor.
   */
  pathRef(editor, path) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      affinity = 'forward'
    } = options;
    var ref = {
      current: path,
      affinity,

      unref() {
        var {
          current
        } = ref;
        var pathRefs = Editor.pathRefs(editor);
        pathRefs.delete(ref);
        ref.current = null;
        return current;
      }

    };
    var refs = Editor.pathRefs(editor);
    refs.add(ref);
    return ref;
  },

  /**
   * Get the set of currently tracked path refs of the editor.
   */
  pathRefs(editor) {
    var refs = PATH_REFS.get(editor);

    if (!refs) {
      refs = new Set();
      PATH_REFS.set(editor, refs);
    }

    return refs;
  },

  /**
   * Get the start or end point of a location.
   */
  point(editor, at) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      edge = 'start'
    } = options;

    if (Path.isPath(at)) {
      var path;

      if (edge === 'end') {
        var [, lastPath] = Node.last(editor, at);
        path = lastPath;
      } else {
        var [, firstPath] = Node.first(editor, at);
        path = firstPath;
      }

      var node = Node.get(editor, path);

      if (!Text.isText(node)) {
        throw new Error("Cannot get the ".concat(edge, " point in the node at path [").concat(at, "] because it has no ").concat(edge, " text node."));
      }

      return {
        path,
        offset: edge === 'end' ? node.text.length : 0
      };
    }

    if (Range.isRange(at)) {
      var [start, end] = Range.edges(at);
      return edge === 'start' ? start : end;
    }

    return at;
  },

  /**
   * Create a mutable ref for a `Point` object, which will stay in sync as new
   * operations are applied to the editor.
   */
  pointRef(editor, point) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      affinity = 'forward'
    } = options;
    var ref = {
      current: point,
      affinity,

      unref() {
        var {
          current
        } = ref;
        var pointRefs = Editor.pointRefs(editor);
        pointRefs.delete(ref);
        ref.current = null;
        return current;
      }

    };
    var refs = Editor.pointRefs(editor);
    refs.add(ref);
    return ref;
  },

  /**
   * Get the set of currently tracked point refs of the editor.
   */
  pointRefs(editor) {
    var refs = POINT_REFS.get(editor);

    if (!refs) {
      refs = new Set();
      POINT_REFS.set(editor, refs);
    }

    return refs;
  },

  /**
   * Return all the positions in `at` range where a `Point` can be placed.
   *
   * By default, moves forward by individual offsets at a time, but
   * the `unit` option can be used to to move by character, word, line, or block.
   *
   * The `reverse` option can be used to change iteration direction.
   *
   * Note: By default void nodes are treated as a single point and iteration
   * will not happen inside their content unless you pass in true for the
   * `voids` option, then iteration will occur.
   */
  *positions(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      at = editor.selection,
      unit = 'offset',
      reverse = false,
      voids = false
    } = options;

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
    var [start, end] = Range.edges(range);
    var first = reverse ? end : start;
    var isNewBlock = false;
    var blockText = '';
    var distance = 0; // Distance for leafText to catch up to blockText.

    var leafTextRemaining = 0;
    var leafTextOffset = 0; // Iterate through all nodes in range, grabbing entire textual content
    // of block nodes in blockText, and text nodes in leafText.
    // Exploits the fact that nodes are sequenced in such a way that we first
    // encounter the block node, then all of its text nodes, so when iterating
    // through the blockText and leafText we just need to remember a window of
    // one block node and leaf node, respectively.

    for (var [node, path] of Editor.nodes(editor, {
      at,
      reverse,
      voids
    })) {
      /*
       * ELEMENT NODE - Yield position(s) for voids, collect blockText for blocks
       */
      if (Element.isElement(node)) {
        // Void nodes are a special case, so by default we will always
        // yield their first point. If the `voids` option is set to true,
        // then we will iterate over their content.
        if (!voids && editor.isVoid(node)) {
          yield Editor.start(editor, path);
          continue;
        } // Inline element nodes are ignored as they don't themselves
        // contribute to `blockText` or `leafText` - their parent and
        // children do.


        if (editor.isInline(node)) continue; // Block element node - set `blockText` to its text content.

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
            voids
          });
          isNewBlock = true;
        }
      }
      /*
       * TEXT LEAF NODE - Iterate through text content, yielding
       * positions every `distance` offset according to `unit`.
       */


      if (Text.isText(node)) {
        var isFirst = Path.equals(path, first.path); // Proof that we always exhaust text nodes before encountering a new one:
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
        } // Yield position at the start of node (potentially).


        if (isFirst || isNewBlock || unit === 'offset') {
          yield {
            path,
            offset: leafTextOffset
          };
          isNewBlock = false;
        } // Yield positions every (dynamically calculated) `distance` offset.


        while (true) {
          // If `leafText` has caught up with `blockText` (distance=0),
          // and if blockText is exhausted, break to get another block node,
          // otherwise advance blockText forward by the new `distance`.
          if (distance === 0) {
            if (blockText === '') break;
            distance = calcDistance(blockText, unit, reverse); // Split the string at the previously found distance and use the
            // remaining string for the next iteration.

            blockText = splitByCharacterDistance(blockText, distance, reverse)[1];
          } // Advance `leafText` by the current `distance`.


          leafTextOffset = reverse ? leafTextOffset - distance : leafTextOffset + distance;
          leafTextRemaining = leafTextRemaining - distance; // If `leafText` is exhausted, break to get a new leaf node
          // and set distance to the overflow amount, so we'll (maybe)
          // catch up to blockText in the next leaf text node.

          if (leafTextRemaining < 0) {
            distance = -leafTextRemaining;
            break;
          } // Successfully walked `distance` offsets through `leafText`
          // to catch up with `blockText`, so we can reset `distance`
          // and yield this position in this node.


          distance = 0;
          yield {
            path,
            offset: leafTextOffset
          };
        }
      }
    } // Proof that upon completion, we've exahusted both leaf and block text:
    //   console.assert(leafTextRemaining <= 0, "leafText wasn't exhausted")
    //   console.assert(blockText === '', "blockText wasn't exhausted")
    // Helper:
    // Return the distance in offsets for a step of size `unit` on given string.


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
  },

  /**
   * Get the matching node in the branch of the document before a location.
   */
  previous(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      mode = 'lowest',
      voids = false
    } = options;
    var {
      match,
      at = editor.selection
    } = options;

    if (!at) {
      return;
    }

    var pointBeforeLocation = Editor.before(editor, at, {
      voids
    });

    if (!pointBeforeLocation) {
      return;
    }

    var [, to] = Editor.first(editor, []); // The search location is from the start of the document to the path of
    // the point before the location passed in

    var span = [pointBeforeLocation.path, to];

    if (Path.isPath(at) && at.length === 0) {
      throw new Error("Cannot get the previous node from the root node!");
    }

    if (match == null) {
      if (Path.isPath(at)) {
        var [parent] = Editor.parent(editor, at);

        match = n => parent.children.includes(n);
      } else {
        match = () => true;
      }
    }

    var [previous] = Editor.nodes(editor, {
      reverse: true,
      at: span,
      match,
      mode,
      voids
    });
    return previous;
  },

  /**
   * Get a range of a location.
   */
  range(editor, at, to) {
    if (Range.isRange(at) && !to) {
      return at;
    }

    var start = Editor.start(editor, at);
    var end = Editor.end(editor, to || at);
    return {
      anchor: start,
      focus: end
    };
  },

  /**
   * Create a mutable ref for a `Range` object, which will stay in sync as new
   * operations are applied to the editor.
   */
  rangeRef(editor, range) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      affinity = 'forward'
    } = options;
    var ref = {
      current: range,
      affinity,

      unref() {
        var {
          current
        } = ref;
        var rangeRefs = Editor.rangeRefs(editor);
        rangeRefs.delete(ref);
        ref.current = null;
        return current;
      }

    };
    var refs = Editor.rangeRefs(editor);
    refs.add(ref);
    return ref;
  },

  /**
   * Get the set of currently tracked range refs of the editor.
   */
  rangeRefs(editor) {
    var refs = RANGE_REFS.get(editor);

    if (!refs) {
      refs = new Set();
      RANGE_REFS.set(editor, refs);
    }

    return refs;
  },

  /**
   * Remove a custom property from all of the leaf text nodes in the current
   * selection.
   *
   * If the selection is currently collapsed, the removal will be stored on
   * `editor.marks` and applied to the text inserted next.
   */
  removeMark(editor, key) {
    editor.removeMark(key);
  },

  /**
   * Manually set if the editor should currently be normalizing.
   *
   * Note: Using this incorrectly can leave the editor in an invalid state.
   *
   */
  setNormalizing(editor, isNormalizing) {
    NORMALIZING.set(editor, isNormalizing);
  },

  /**
   * Get the start point of a location.
   */
  start(editor, at) {
    return Editor.point(editor, at, {
      edge: 'start'
    });
  },

  /**
   * Get the text string content of a location.
   *
   * Note: by default the text of void nodes is considered to be an empty
   * string, regardless of content, unless you pass in true for the voids option
   */
  string(editor, at) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      voids = false
    } = options;
    var range = Editor.range(editor, at);
    var [start, end] = Range.edges(range);
    var text = '';

    for (var [node, path] of Editor.nodes(editor, {
      at: range,
      match: Text.isText,
      voids
    })) {
      var t = node.text;

      if (Path.equals(path, end.path)) {
        t = t.slice(0, end.offset);
      }

      if (Path.equals(path, start.path)) {
        t = t.slice(start.offset);
      }

      text += t;
    }

    return text;
  },

  /**
   * Convert a range into a non-hanging one.
   */
  unhangRange(editor, range) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      voids = false
    } = options;
    var [start, end] = Range.edges(range); // PERF: exit early if we can guarantee that the range isn't hanging.

    if (start.offset !== 0 || end.offset !== 0 || Range.isCollapsed(range)) {
      return range;
    }

    var endBlock = Editor.above(editor, {
      at: end,
      match: n => Editor.isBlock(editor, n)
    });
    var blockPath = endBlock ? endBlock[1] : [];
    var first = Editor.start(editor, start);
    var before = {
      anchor: first,
      focus: end
    };
    var skip = true;

    for (var [node, path] of Editor.nodes(editor, {
      at: before,
      match: Text.isText,
      reverse: true,
      voids
    })) {
      if (skip) {
        skip = false;
        continue;
      }

      if (node.text !== '' || Path.isBefore(path, blockPath)) {
        end = {
          path,
          offset: node.text.length
        };
        break;
      }
    }

    return {
      anchor: start,
      focus: end
    };
  },

  /**
   * Match a void node in the current branch of the editor.
   */
  void(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Editor.above(editor, _objectSpread$8(_objectSpread$8({}, options), {}, {
      match: n => Editor.isVoid(editor, n)
    }));
  },

  /**
   * Call a function, deferring normalization until after it completes.
   */
  withoutNormalizing(editor, fn) {
    var value = Editor.isNormalizing(editor);
    Editor.setNormalizing(editor, false);

    try {
      fn();
    } finally {
      Editor.setNormalizing(editor, value);
    }

    Editor.normalize(editor);
  }

};

var Location = {
  /**
   * Check if a value implements the `Location` interface.
   */
  isLocation(value) {
    return Path.isPath(value) || Point.isPoint(value) || Range.isRange(value);
  }

};
var Span = {
  /**
   * Check if a value implements the `Span` interface.
   */
  isSpan(value) {
    return Array.isArray(value) && value.length === 2 && value.every(Path.isPath);
  }

};

var _excluded$3 = ["children"],
    _excluded2$2 = ["text"];
var IS_NODE_LIST_CACHE = new WeakMap();
var Node = {
  /**
   * Get the node at a specific path, asserting that it's an ancestor node.
   */
  ancestor(root, path) {
    var node = Node.get(root, path);

    if (Text.isText(node)) {
      throw new Error("Cannot get the ancestor node at path [".concat(path, "] because it refers to a text node instead: ").concat(Scrubber.stringify(node)));
    }

    return node;
  },

  /**
   * Return a generator of all the ancestor nodes above a specific path.
   *
   * By default the order is top-down, from highest to lowest ancestor in
   * the tree, but you can pass the `reverse: true` option to go bottom-up.
   */
  *ancestors(root, path) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var p of Path.ancestors(path, options)) {
      var n = Node.ancestor(root, p);
      var entry = [n, p];
      yield entry;
    }
  },

  /**
   * Get the child of a node at a specific index.
   */
  child(root, index) {
    if (Text.isText(root)) {
      throw new Error("Cannot get the child of a text node: ".concat(Scrubber.stringify(root)));
    }

    var c = root.children[index];

    if (c == null) {
      throw new Error("Cannot get child at index `".concat(index, "` in node: ").concat(Scrubber.stringify(root)));
    }

    return c;
  },

  /**
   * Iterate over the children of a node at a specific path.
   */
  *children(root, path) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      reverse = false
    } = options;
    var ancestor = Node.ancestor(root, path);
    var {
      children
    } = ancestor;
    var index = reverse ? children.length - 1 : 0;

    while (reverse ? index >= 0 : index < children.length) {
      var child = Node.child(ancestor, index);
      var childPath = path.concat(index);
      yield [child, childPath];
      index = reverse ? index - 1 : index + 1;
    }
  },

  /**
   * Get an entry for the common ancesetor node of two paths.
   */
  common(root, path, another) {
    var p = Path.common(path, another);
    var n = Node.get(root, p);
    return [n, p];
  },

  /**
   * Get the node at a specific path, asserting that it's a descendant node.
   */
  descendant(root, path) {
    var node = Node.get(root, path);

    if (Editor.isEditor(node)) {
      throw new Error("Cannot get the descendant node at path [".concat(path, "] because it refers to the root editor node instead: ").concat(Scrubber.stringify(node)));
    }

    return node;
  },

  /**
   * Return a generator of all the descendant node entries inside a root node.
   */
  *descendants(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var [node, path] of Node.nodes(root, options)) {
      if (path.length !== 0) {
        // NOTE: we have to coerce here because checking the path's length does
        // guarantee that `node` is not a `Editor`, but TypeScript doesn't know.
        yield [node, path];
      }
    }
  },

  /**
   * Return a generator of all the element nodes inside a root node. Each iteration
   * will return an `ElementEntry` tuple consisting of `[Element, Path]`. If the
   * root node is an element it will be included in the iteration as well.
   */
  *elements(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var [node, path] of Node.nodes(root, options)) {
      if (Element.isElement(node)) {
        yield [node, path];
      }
    }
  },

  /**
   * Extract props from a Node.
   */
  extractProps(node) {
    if (Element.isAncestor(node)) {
      var properties = _objectWithoutProperties(node, _excluded$3);

      return properties;
    } else {
      var properties = _objectWithoutProperties(node, _excluded2$2);

      return properties;
    }
  },

  /**
   * Get the first node entry in a root node from a path.
   */
  first(root, path) {
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

  /**
   * Get the sliced fragment represented by a range inside a root node.
   */
  fragment(root, range) {
    if (Text.isText(root)) {
      throw new Error("Cannot get a fragment starting from a root text node: ".concat(Scrubber.stringify(root)));
    }

    var newRoot = produce({
      children: root.children
    }, r => {
      var [start, end] = Range.edges(range);
      var nodeEntries = Node.nodes(r, {
        reverse: true,
        pass: _ref => {
          var [, path] = _ref;
          return !Range.includes(range, path);
        }
      });

      for (var [, path] of nodeEntries) {
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

      if (Editor.isEditor(r)) {
        r.selection = null;
      }
    });
    return newRoot.children;
  },

  /**
   * Get the descendant node referred to by a specific path. If the path is an
   * empty array, it refers to the root node itself.
   */
  get(root, path) {
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

  /**
   * Check if a descendant node exists at a specific path.
   */
  has(root, path) {
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

  /**
   * Check if a value implements the `Node` interface.
   */
  isNode(value) {
    return Text.isText(value) || Element.isElement(value) || Editor.isEditor(value);
  },

  /**
   * Check if a value is a list of `Node` objects.
   */
  isNodeList(value) {
    if (!Array.isArray(value)) {
      return false;
    }

    var cachedResult = IS_NODE_LIST_CACHE.get(value);

    if (cachedResult !== undefined) {
      return cachedResult;
    }

    var isNodeList = value.every(val => Node.isNode(val));
    IS_NODE_LIST_CACHE.set(value, isNodeList);
    return isNodeList;
  },

  /**
   * Get the last node entry in a root node from a path.
   */
  last(root, path) {
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

  /**
   * Get the node at a specific path, ensuring it's a leaf text node.
   */
  leaf(root, path) {
    var node = Node.get(root, path);

    if (!Text.isText(node)) {
      throw new Error("Cannot get the leaf node at path [".concat(path, "] because it refers to a non-leaf node: ").concat(Scrubber.stringify(node)));
    }

    return node;
  },

  /**
   * Return a generator of the in a branch of the tree, from a specific path.
   *
   * By default the order is top-down, from highest to lowest node in the tree,
   * but you can pass the `reverse: true` option to go bottom-up.
   */
  *levels(root, path) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var p of Path.levels(path, options)) {
      var n = Node.get(root, p);
      yield [n, p];
    }
  },

  /**
   * Check if a node matches a set of props.
   */
  matches(node, props) {
    return Element.isElement(node) && Element.isElementProps(props) && Element.matches(node, props) || Text.isText(node) && Text.isTextProps(props) && Text.matches(node, props);
  },

  /**
   * Return a generator of all the node entries of a root node. Each entry is
   * returned as a `[Node, Path]` tuple, with the path referring to the node's
   * position inside the root node.
   */
  *nodes(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      pass,
      reverse = false
    } = options;
    var {
      from = [],
      to
    } = options;
    var visited = new Set();
    var p = [];
    var n = root;

    while (true) {
      if (to && (reverse ? Path.isBefore(p, to) : Path.isAfter(p, to))) {
        break;
      }

      if (!visited.has(n)) {
        yield [n, p];
      } // If we're allowed to go downward and we haven't descended yet, do.


      if (!visited.has(n) && !Text.isText(n) && n.children.length !== 0 && (pass == null || pass([n, p]) === false)) {
        visited.add(n);
        var nextIndex = reverse ? n.children.length - 1 : 0;

        if (Path.isAncestor(p, from)) {
          nextIndex = from[p.length];
        }

        p = p.concat(nextIndex);
        n = Node.get(root, p);
        continue;
      } // If we're at the root and we can't go down, we're done.


      if (p.length === 0) {
        break;
      } // If we're going forward...


      if (!reverse) {
        var newPath = Path.next(p);

        if (Node.has(root, newPath)) {
          p = newPath;
          n = Node.get(root, p);
          continue;
        }
      } // If we're going backward...


      if (reverse && p[p.length - 1] !== 0) {
        var _newPath = Path.previous(p);

        p = _newPath;
        n = Node.get(root, p);
        continue;
      } // Otherwise we're going upward...


      p = Path.parent(p);
      n = Node.get(root, p);
      visited.add(n);
    }
  },

  /**
   * Get the parent of a node at a specific path.
   */
  parent(root, path) {
    var parentPath = Path.parent(path);
    var p = Node.get(root, parentPath);

    if (Text.isText(p)) {
      throw new Error("Cannot get the parent of path [".concat(path, "] because it does not exist in the root."));
    }

    return p;
  },

  /**
   * Get the concatenated text string of a node's content.
   *
   * Note that this will not include spaces or line breaks between block nodes.
   * It is not a user-facing string, but a string for performing offset-related
   * computations for a node.
   */
  string(node) {
    if (Text.isText(node)) {
      return node.text;
    } else {
      return node.children.map(Node.string).join('');
    }
  },

  /**
   * Return a generator of all leaf text nodes in a root node.
   */
  *texts(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var [node, path] of Node.nodes(root, options)) {
      if (Text.isText(node)) {
        yield [node, path];
      }
    }
  }

};

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var Operation = {
  /**
   * Check of a value is a `NodeOperation` object.
   */
  isNodeOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith('_node');
  },

  /**
   * Check of a value is an `Operation` object.
   */
  isOperation(value) {
    if (!isPlainObject(value)) {
      return false;
    }

    switch (value.type) {
      case 'insert_node':
        return Path.isPath(value.path) && Node.isNode(value.node);

      case 'insert_text':
        return typeof value.offset === 'number' && typeof value.text === 'string' && Path.isPath(value.path);

      case 'merge_node':
        return typeof value.position === 'number' && Path.isPath(value.path) && isPlainObject(value.properties);

      case 'move_node':
        return Path.isPath(value.path) && Path.isPath(value.newPath);

      case 'remove_node':
        return Path.isPath(value.path) && Node.isNode(value.node);

      case 'remove_text':
        return typeof value.offset === 'number' && typeof value.text === 'string' && Path.isPath(value.path);

      case 'set_node':
        return Path.isPath(value.path) && isPlainObject(value.properties) && isPlainObject(value.newProperties);

      case 'set_selection':
        return value.properties === null && Range.isRange(value.newProperties) || value.newProperties === null && Range.isRange(value.properties) || isPlainObject(value.properties) && isPlainObject(value.newProperties);

      case 'split_node':
        return Path.isPath(value.path) && typeof value.position === 'number' && isPlainObject(value.properties);

      default:
        return false;
    }
  },

  /**
   * Check if a value is a list of `Operation` objects.
   */
  isOperationList(value) {
    return Array.isArray(value) && value.every(val => Operation.isOperation(val));
  },

  /**
   * Check of a value is a `SelectionOperation` object.
   */
  isSelectionOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith('_selection');
  },

  /**
   * Check of a value is a `TextOperation` object.
   */
  isTextOperation(value) {
    return Operation.isOperation(value) && value.type.endsWith('_text');
  },

  /**
   * Invert an operation, returning a new operation that will exactly undo the
   * original when applied.
   */
  inverse(op) {
    switch (op.type) {
      case 'insert_node':
        {
          return _objectSpread$7(_objectSpread$7({}, op), {}, {
            type: 'remove_node'
          });
        }

      case 'insert_text':
        {
          return _objectSpread$7(_objectSpread$7({}, op), {}, {
            type: 'remove_text'
          });
        }

      case 'merge_node':
        {
          return _objectSpread$7(_objectSpread$7({}, op), {}, {
            type: 'split_node',
            path: Path.previous(op.path)
          });
        }

      case 'move_node':
        {
          var {
            newPath,
            path
          } = op; // PERF: in this case the move operation is a no-op anyways.

          if (Path.equals(newPath, path)) {
            return op;
          } // If the move happens completely within a single parent the path and
          // newPath are stable with respect to each other.


          if (Path.isSibling(path, newPath)) {
            return _objectSpread$7(_objectSpread$7({}, op), {}, {
              path: newPath,
              newPath: path
            });
          } // If the move does not happen within a single parent it is possible
          // for the move to impact the true path to the location where the node
          // was removed from and where it was inserted. We have to adjust for this
          // and find the original path. We can accomplish this (only in non-sibling)
          // moves by looking at the impact of the move operation on the node
          // after the original move path.


          var inversePath = Path.transform(path, op);
          var inverseNewPath = Path.transform(Path.next(path), op);
          return _objectSpread$7(_objectSpread$7({}, op), {}, {
            path: inversePath,
            newPath: inverseNewPath
          });
        }

      case 'remove_node':
        {
          return _objectSpread$7(_objectSpread$7({}, op), {}, {
            type: 'insert_node'
          });
        }

      case 'remove_text':
        {
          return _objectSpread$7(_objectSpread$7({}, op), {}, {
            type: 'insert_text'
          });
        }

      case 'set_node':
        {
          var {
            properties,
            newProperties
          } = op;
          return _objectSpread$7(_objectSpread$7({}, op), {}, {
            properties: newProperties,
            newProperties: properties
          });
        }

      case 'set_selection':
        {
          var {
            properties: _properties,
            newProperties: _newProperties
          } = op;

          if (_properties == null) {
            return _objectSpread$7(_objectSpread$7({}, op), {}, {
              properties: _newProperties,
              newProperties: null
            });
          } else if (_newProperties == null) {
            return _objectSpread$7(_objectSpread$7({}, op), {}, {
              properties: null,
              newProperties: _properties
            });
          } else {
            return _objectSpread$7(_objectSpread$7({}, op), {}, {
              properties: _newProperties,
              newProperties: _properties
            });
          }
        }

      case 'split_node':
        {
          return _objectSpread$7(_objectSpread$7({}, op), {}, {
            type: 'merge_node',
            path: Path.next(op.path)
          });
        }
    }
  }

};

var Path = {
  /**
   * Get a list of ancestor paths for a given path.
   *
   * The paths are sorted from shallowest to deepest ancestor. However, if the
   * `reverse: true` option is passed, they are reversed.
   */
  ancestors(path) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      reverse = false
    } = options;
    var paths = Path.levels(path, options);

    if (reverse) {
      paths = paths.slice(1);
    } else {
      paths = paths.slice(0, -1);
    }

    return paths;
  },

  /**
   * Get the common ancestor path of two paths.
   */
  common(path, another) {
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

  /**
   * Compare a path to another, returning an integer indicating whether the path
   * was before, at, or after the other.
   *
   * Note: Two paths of unequal length can still receive a `0` result if one is
   * directly above or below the other. If you want exact matching, use
   * [[Path.equals]] instead.
   */
  compare(path, another) {
    var min = Math.min(path.length, another.length);

    for (var i = 0; i < min; i++) {
      if (path[i] < another[i]) return -1;
      if (path[i] > another[i]) return 1;
    }

    return 0;
  },

  /**
   * Check if a path ends after one of the indexes in another.
   */
  endsAfter(path, another) {
    var i = path.length - 1;
    var as = path.slice(0, i);
    var bs = another.slice(0, i);
    var av = path[i];
    var bv = another[i];
    return Path.equals(as, bs) && av > bv;
  },

  /**
   * Check if a path ends at one of the indexes in another.
   */
  endsAt(path, another) {
    var i = path.length;
    var as = path.slice(0, i);
    var bs = another.slice(0, i);
    return Path.equals(as, bs);
  },

  /**
   * Check if a path ends before one of the indexes in another.
   */
  endsBefore(path, another) {
    var i = path.length - 1;
    var as = path.slice(0, i);
    var bs = another.slice(0, i);
    var av = path[i];
    var bv = another[i];
    return Path.equals(as, bs) && av < bv;
  },

  /**
   * Check if a path is exactly equal to another.
   */
  equals(path, another) {
    return path.length === another.length && path.every((n, i) => n === another[i]);
  },

  /**
   * Check if the path of previous sibling node exists
   */
  hasPrevious(path) {
    return path[path.length - 1] > 0;
  },

  /**
   * Check if a path is after another.
   */
  isAfter(path, another) {
    return Path.compare(path, another) === 1;
  },

  /**
   * Check if a path is an ancestor of another.
   */
  isAncestor(path, another) {
    return path.length < another.length && Path.compare(path, another) === 0;
  },

  /**
   * Check if a path is before another.
   */
  isBefore(path, another) {
    return Path.compare(path, another) === -1;
  },

  /**
   * Check if a path is a child of another.
   */
  isChild(path, another) {
    return path.length === another.length + 1 && Path.compare(path, another) === 0;
  },

  /**
   * Check if a path is equal to or an ancestor of another.
   */
  isCommon(path, another) {
    return path.length <= another.length && Path.compare(path, another) === 0;
  },

  /**
   * Check if a path is a descendant of another.
   */
  isDescendant(path, another) {
    return path.length > another.length && Path.compare(path, another) === 0;
  },

  /**
   * Check if a path is the parent of another.
   */
  isParent(path, another) {
    return path.length + 1 === another.length && Path.compare(path, another) === 0;
  },

  /**
   * Check is a value implements the `Path` interface.
   */
  isPath(value) {
    return Array.isArray(value) && (value.length === 0 || typeof value[0] === 'number');
  },

  /**
   * Check if a path is a sibling of another.
   */
  isSibling(path, another) {
    if (path.length !== another.length) {
      return false;
    }

    var as = path.slice(0, -1);
    var bs = another.slice(0, -1);
    var al = path[path.length - 1];
    var bl = another[another.length - 1];
    return al !== bl && Path.equals(as, bs);
  },

  /**
   * Get a list of paths at every level down to a path. Note: this is the same
   * as `Path.ancestors`, but including the path itself.
   *
   * The paths are sorted from shallowest to deepest. However, if the `reverse:
   * true` option is passed, they are reversed.
   */
  levels(path) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      reverse = false
    } = options;
    var list = [];

    for (var i = 0; i <= path.length; i++) {
      list.push(path.slice(0, i));
    }

    if (reverse) {
      list.reverse();
    }

    return list;
  },

  /**
   * Given a path, get the path to the next sibling node.
   */
  next(path) {
    if (path.length === 0) {
      throw new Error("Cannot get the next path of a root path [".concat(path, "], because it has no next index."));
    }

    var last = path[path.length - 1];
    return path.slice(0, -1).concat(last + 1);
  },

  /**
   * Returns whether this operation can affect paths or not. Used as an
   * optimization when updating dirty paths during normalization
   *
   * NOTE: This *must* be kept in sync with the implementation of 'transform'
   * below
   */
  operationCanTransformPath(operation) {
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

  /**
   * Given a path, return a new path referring to the parent node above it.
   */
  parent(path) {
    if (path.length === 0) {
      throw new Error("Cannot get the parent path of the root path [".concat(path, "]."));
    }

    return path.slice(0, -1);
  },

  /**
   * Given a path, get the path to the previous sibling node.
   */
  previous(path) {
    if (path.length === 0) {
      throw new Error("Cannot get the previous path of a root path [".concat(path, "], because it has no previous index."));
    }

    var last = path[path.length - 1];

    if (last <= 0) {
      throw new Error("Cannot get the previous path of a first child path [".concat(path, "] because it would result in a negative index."));
    }

    return path.slice(0, -1).concat(last - 1);
  },

  /**
   * Get a path relative to an ancestor.
   */
  relative(path, ancestor) {
    if (!Path.isAncestor(ancestor, path) && !Path.equals(path, ancestor)) {
      throw new Error("Cannot get the relative path of [".concat(path, "] inside ancestor [").concat(ancestor, "], because it is not above or equal to the path."));
    }

    return path.slice(ancestor.length);
  },

  /**
   * Transform a path by an operation.
   */
  transform(path, operation) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return produce(path, p => {
      var {
        affinity = 'forward'
      } = options; // PERF: Exit early if the operation is guaranteed not to have an effect.

      if (!path || (path === null || path === void 0 ? void 0 : path.length) === 0) {
        return;
      }

      if (p === null) {
        return null;
      }

      switch (operation.type) {
        case 'insert_node':
          {
            var {
              path: op
            } = operation;

            if (Path.equals(op, p) || Path.endsBefore(op, p) || Path.isAncestor(op, p)) {
              p[op.length - 1] += 1;
            }

            break;
          }

        case 'remove_node':
          {
            var {
              path: _op
            } = operation;

            if (Path.equals(_op, p) || Path.isAncestor(_op, p)) {
              return null;
            } else if (Path.endsBefore(_op, p)) {
              p[_op.length - 1] -= 1;
            }

            break;
          }

        case 'merge_node':
          {
            var {
              path: _op2,
              position
            } = operation;

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
            var {
              path: _op3,
              position: _position
            } = operation;

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
            var {
              path: _op4,
              newPath: onp
            } = operation; // If the old and new path are the same, it's a no-op.

            if (Path.equals(_op4, onp)) {
              return;
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
    });
  }

};

var PathRef = {
  /**
   * Transform the path ref's current value by an operation.
   */
  transform(ref, op) {
    var {
      current,
      affinity
    } = ref;

    if (current == null) {
      return;
    }

    var path = Path.transform(current, op, {
      affinity
    });
    ref.current = path;

    if (path == null) {
      ref.unref();
    }
  }

};

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var Point = {
  /**
   * Compare a point to another, returning an integer indicating whether the
   * point was before, at, or after the other.
   */
  compare(point, another) {
    var result = Path.compare(point.path, another.path);

    if (result === 0) {
      if (point.offset < another.offset) return -1;
      if (point.offset > another.offset) return 1;
      return 0;
    }

    return result;
  },

  /**
   * Check if a point is after another.
   */
  isAfter(point, another) {
    return Point.compare(point, another) === 1;
  },

  /**
   * Check if a point is before another.
   */
  isBefore(point, another) {
    return Point.compare(point, another) === -1;
  },

  /**
   * Check if a point is exactly equal to another.
   */
  equals(point, another) {
    // PERF: ensure the offsets are equal first since they are cheaper to check.
    return point.offset === another.offset && Path.equals(point.path, another.path);
  },

  /**
   * Check if a value implements the `Point` interface.
   */
  isPoint(value) {
    return isPlainObject(value) && typeof value.offset === 'number' && Path.isPath(value.path);
  },

  /**
   * Transform a point by an operation.
   */
  transform(point, op) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return produce(point, p => {
      if (p === null) {
        return null;
      }

      var {
        affinity = 'forward'
      } = options;
      var {
        path,
        offset
      } = p;

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
                p.path = Path.transform(path, op, _objectSpread$6(_objectSpread$6({}, options), {}, {
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

var PointRef = {
  /**
   * Transform the point ref's current value by an operation.
   */
  transform(ref, op) {
    var {
      current,
      affinity
    } = ref;

    if (current == null) {
      return;
    }

    var point = Point.transform(current, op, {
      affinity
    });
    ref.current = point;

    if (point == null) {
      ref.unref();
    }
  }

};

var _excluded$2 = ["anchor", "focus"];

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var Range = {
  /**
   * Get the start and end points of a range, in the order in which they appear
   * in the document.
   */
  edges(range) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      reverse = false
    } = options;
    var {
      anchor,
      focus
    } = range;
    return Range.isBackward(range) === reverse ? [anchor, focus] : [focus, anchor];
  },

  /**
   * Get the end point of a range.
   */
  end(range) {
    var [, end] = Range.edges(range);
    return end;
  },

  /**
   * Check if a range is exactly equal to another.
   */
  equals(range, another) {
    return Point.equals(range.anchor, another.anchor) && Point.equals(range.focus, another.focus);
  },

  /**
   * Check if a range includes a path, a point or part of another range.
   */
  includes(range, target) {
    if (Range.isRange(target)) {
      if (Range.includes(range, target.anchor) || Range.includes(range, target.focus)) {
        return true;
      }

      var [rs, re] = Range.edges(range);
      var [ts, te] = Range.edges(target);
      return Point.isBefore(rs, ts) && Point.isAfter(re, te);
    }

    var [start, end] = Range.edges(range);
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

  /**
   * Get the intersection of a range with another.
   */
  intersection(range, another) {
    var rest = _objectWithoutProperties(range, _excluded$2);

    var [s1, e1] = Range.edges(range);
    var [s2, e2] = Range.edges(another);
    var start = Point.isBefore(s1, s2) ? s2 : s1;
    var end = Point.isBefore(e1, e2) ? e1 : e2;

    if (Point.isBefore(end, start)) {
      return null;
    } else {
      return _objectSpread$5({
        anchor: start,
        focus: end
      }, rest);
    }
  },

  /**
   * Check if a range is backward, meaning that its anchor point appears in the
   * document _after_ its focus point.
   */
  isBackward(range) {
    var {
      anchor,
      focus
    } = range;
    return Point.isAfter(anchor, focus);
  },

  /**
   * Check if a range is collapsed, meaning that both its anchor and focus
   * points refer to the exact same position in the document.
   */
  isCollapsed(range) {
    var {
      anchor,
      focus
    } = range;
    return Point.equals(anchor, focus);
  },

  /**
   * Check if a range is expanded.
   *
   * This is the opposite of [[Range.isCollapsed]] and is provided for legibility.
   */
  isExpanded(range) {
    return !Range.isCollapsed(range);
  },

  /**
   * Check if a range is forward.
   *
   * This is the opposite of [[Range.isBackward]] and is provided for legibility.
   */
  isForward(range) {
    return !Range.isBackward(range);
  },

  /**
   * Check if a value implements the [[Range]] interface.
   */
  isRange(value) {
    return isPlainObject(value) && Point.isPoint(value.anchor) && Point.isPoint(value.focus);
  },

  /**
   * Iterate through all of the point entries in a range.
   */
  *points(range) {
    yield [range.anchor, 'anchor'];
    yield [range.focus, 'focus'];
  },

  /**
   * Get the start point of a range.
   */
  start(range) {
    var [start] = Range.edges(range);
    return start;
  },

  /**
   * Transform a range by an operation.
   */
  transform(range, op) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return produce(range, r => {
      if (r === null) {
        return null;
      }

      var {
        affinity = 'inward'
      } = options;
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

var RangeRef = {
  /**
   * Transform the range ref's current value by an operation.
   */
  transform(ref, op) {
    var {
      current,
      affinity
    } = ref;

    if (current == null) {
      return;
    }

    var path = Range.transform(current, op, {
      affinity
    });
    ref.current = path;

    if (path == null) {
      ref.unref();
    }
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

var Scrubber = {
  setScrubber(scrubber) {
    _scrubber = scrubber;
  },

  stringify(value) {
    return JSON.stringify(value, _scrubber);
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

var isDeepEqual = (node, another) => {
  for (var key in node) {
    var a = node[key];
    var b = another[key];

    if (isPlainObject(a) && isPlainObject(b)) {
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

var _excluded$1 = ["text"],
    _excluded2$1 = ["anchor", "focus"];

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var Text = {
  /**
   * Check if two text nodes are equal.
   *
   * When loose is set, the text is not compared. This is
   * used to check whether sibling text nodes can be merged.
   */
  equals(text, another) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      loose = false
    } = options;

    function omitText(obj) {
      var rest = _objectWithoutProperties(obj, _excluded$1);

      return rest;
    }

    return isDeepEqual(loose ? omitText(text) : text, loose ? omitText(another) : another);
  },

  /**
   * Check if a value implements the `Text` interface.
   */
  isText(value) {
    return isPlainObject(value) && typeof value.text === 'string';
  },

  /**
   * Check if a value is a list of `Text` objects.
   */
  isTextList(value) {
    return Array.isArray(value) && value.every(val => Text.isText(val));
  },

  /**
   * Check if some props are a partial of Text.
   */
  isTextProps(props) {
    return props.text !== undefined;
  },

  /**
   * Check if an text matches set of properties.
   *
   * Note: this is for matching custom properties, and it does not ensure that
   * the `text` property are two nodes equal.
   */
  matches(text, props) {
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

  /**
   * Get the leaves for a text node given decorations.
   */
  decorations(node, decorations) {
    var leaves = [_objectSpread$4({}, node)];

    for (var dec of decorations) {
      var rest = _objectWithoutProperties(dec, _excluded2$1);

      var [start, end] = Range.edges(dec);
      var next = [];
      var o = 0;

      for (var leaf of leaves) {
        var {
          length
        } = leaf.text;
        var offset = o;
        o += length; // If the range encompases the entire leaf, add the range.

        if (start.offset <= offset && end.offset >= o) {
          Object.assign(leaf, rest);
          next.push(leaf);
          continue;
        } // If the range expanded and match the leaf, or starts after, or ends before it, continue.


        if (start.offset !== end.offset && (start.offset === o || end.offset === offset) || start.offset > o || end.offset < offset || end.offset === offset && offset !== 0) {
          next.push(leaf);
          continue;
        } // Otherwise we need to split the leaf, at the start, end, or both,
        // and add the range to the middle intersecting section. Do the end
        // split first since we don't need to update the offset that way.


        var middle = leaf;
        var before = void 0;
        var after = void 0;

        if (end.offset < o) {
          var off = end.offset - offset;
          after = _objectSpread$4(_objectSpread$4({}, middle), {}, {
            text: middle.text.slice(off)
          });
          middle = _objectSpread$4(_objectSpread$4({}, middle), {}, {
            text: middle.text.slice(0, off)
          });
        }

        if (start.offset > offset) {
          var _off = start.offset - offset;

          before = _objectSpread$4(_objectSpread$4({}, middle), {}, {
            text: middle.text.slice(0, _off)
          });
          middle = _objectSpread$4(_objectSpread$4({}, middle), {}, {
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

      leaves = next;
    }

    return leaves;
  }

};

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var applyToDraft = (editor, selection, op) => {
  switch (op.type) {
    case 'insert_node':
      {
        var {
          path,
          node
        } = op;
        var parent = Node.parent(editor, path);
        var index = path[path.length - 1];

        if (index > parent.children.length) {
          throw new Error("Cannot apply an \"insert_node\" operation at path [".concat(path, "] because the destination is past the end of the node."));
        }

        parent.children.splice(index, 0, node);

        if (selection) {
          for (var [point, key] of Range.points(selection)) {
            selection[key] = Point.transform(point, op);
          }
        }

        break;
      }

    case 'insert_text':
      {
        var {
          path: _path,
          offset,
          text
        } = op;
        if (text.length === 0) break;

        var _node = Node.leaf(editor, _path);

        var before = _node.text.slice(0, offset);

        var after = _node.text.slice(offset);

        _node.text = before + text + after;

        if (selection) {
          for (var [_point, _key] of Range.points(selection)) {
            selection[_key] = Point.transform(_point, op);
          }
        }

        break;
      }

    case 'merge_node':
      {
        var {
          path: _path2
        } = op;

        var _node2 = Node.get(editor, _path2);

        var prevPath = Path.previous(_path2);
        var prev = Node.get(editor, prevPath);

        var _parent = Node.parent(editor, _path2);

        var _index = _path2[_path2.length - 1];

        if (Text.isText(_node2) && Text.isText(prev)) {
          prev.text += _node2.text;
        } else if (!Text.isText(_node2) && !Text.isText(prev)) {
          prev.children.push(..._node2.children);
        } else {
          throw new Error("Cannot apply a \"merge_node\" operation at path [".concat(_path2, "] to nodes of different interfaces: ").concat(Scrubber.stringify(_node2), " ").concat(Scrubber.stringify(prev)));
        }

        _parent.children.splice(_index, 1);

        if (selection) {
          for (var [_point2, _key2] of Range.points(selection)) {
            selection[_key2] = Point.transform(_point2, op);
          }
        }

        break;
      }

    case 'move_node':
      {
        var {
          path: _path3,
          newPath
        } = op;

        if (Path.isAncestor(_path3, newPath)) {
          throw new Error("Cannot move a path [".concat(_path3, "] to new path [").concat(newPath, "] because the destination is inside itself."));
        }

        var _node3 = Node.get(editor, _path3);

        var _parent2 = Node.parent(editor, _path3);

        var _index2 = _path3[_path3.length - 1]; // This is tricky, but since the `path` and `newPath` both refer to
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
          for (var [_point3, _key3] of Range.points(selection)) {
            selection[_key3] = Point.transform(_point3, op);
          }
        }

        break;
      }

    case 'remove_node':
      {
        var {
          path: _path4
        } = op;
        var _index3 = _path4[_path4.length - 1];

        var _parent3 = Node.parent(editor, _path4);

        _parent3.children.splice(_index3, 1); // Transform all of the points in the value, but if the point was in the
        // node that was removed we need to update the range or remove it.


        if (selection) {
          for (var [_point4, _key4] of Range.points(selection)) {
            var result = Point.transform(_point4, op);

            if (selection != null && result != null) {
              selection[_key4] = result;
            } else {
              var _prev = void 0;

              var next = void 0;

              for (var [n, p] of Node.texts(editor)) {
                if (Path.compare(p, _path4) === -1) {
                  _prev = [n, p];
                } else {
                  next = [n, p];
                  break;
                }
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
        }

        break;
      }

    case 'remove_text':
      {
        var {
          path: _path5,
          offset: _offset,
          text: _text
        } = op;
        if (_text.length === 0) break;

        var _node4 = Node.leaf(editor, _path5);

        var _before = _node4.text.slice(0, _offset);

        var _after = _node4.text.slice(_offset + _text.length);

        _node4.text = _before + _after;

        if (selection) {
          for (var [_point5, _key5] of Range.points(selection)) {
            selection[_key5] = Point.transform(_point5, op);
          }
        }

        break;
      }

    case 'set_node':
      {
        var {
          path: _path6,
          properties,
          newProperties
        } = op;

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
        } // properties that were previously defined, but are now missing, must be deleted


        for (var _key7 in properties) {
          if (!newProperties.hasOwnProperty(_key7)) {
            delete _node5[_key7];
          }
        }

        break;
      }

    case 'set_selection':
      {
        var {
          newProperties: _newProperties
        } = op;

        if (_newProperties == null) {
          selection = _newProperties;
        } else {
          if (selection == null) {
            if (!Range.isRange(_newProperties)) {
              throw new Error("Cannot apply an incomplete \"set_selection\" operation properties ".concat(Scrubber.stringify(_newProperties), " when there is no current selection."));
            }

            selection = _objectSpread$3({}, _newProperties);
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
        var {
          path: _path7,
          position,
          properties: _properties
        } = op;

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
          newNode = _objectSpread$3(_objectSpread$3({}, _properties), {}, {
            text: _after2
          });
        } else {
          var _before3 = _node6.children.slice(0, position);

          var _after3 = _node6.children.slice(position);

          _node6.children = _before3;
          newNode = _objectSpread$3(_objectSpread$3({}, _properties), {}, {
            children: _after3
          });
        }

        _parent4.children.splice(_index4 + 1, 0, newNode);

        if (selection) {
          for (var [_point6, _key9] of Range.points(selection)) {
            selection[_key9] = Point.transform(_point6, op);
          }
        }

        break;
      }
  }

  return selection;
};

var GeneralTransforms = {
  /**
   * Transform the editor by an operation.
   */
  transform(editor, op) {
    editor.children = createDraft(editor.children);
    var selection = editor.selection && createDraft(editor.selection);

    try {
      selection = applyToDraft(editor, selection, op);
    } finally {
      editor.children = finishDraft(editor.children);

      if (selection) {
        editor.selection = isDraft(selection) ? finishDraft(selection) : selection;
      } else {
        editor.selection = null;
      }
    }
  }

};

var _excluded = ["text"],
    _excluded2 = ["children"];

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var NodeTransforms = {
  /**
   * Insert nodes at a specific location in the Editor.
   */
  insertNodes(editor, nodes) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        hanging = false,
        voids = false,
        mode = 'lowest'
      } = options;
      var {
        at,
        match,
        select
      } = options;

      if (Node.isNode(nodes)) {
        nodes = [nodes];
      }

      if (nodes.length === 0) {
        return;
      }

      var [node] = nodes; // By default, use the selection as the target location. But if there is
      // no selection, insert at the end of the document since that is such a
      // common use case when inserting from a non-selected state.

      if (!at) {
        if (editor.selection) {
          at = editor.selection;
        } else if (editor.children.length > 0) {
          at = Editor.end(editor, []);
        } else {
          at = [0];
        }

        select = true;
      }

      if (select == null) {
        select = false;
      }

      if (Range.isRange(at)) {
        if (!hanging) {
          at = Editor.unhangRange(editor, at);
        }

        if (Range.isCollapsed(at)) {
          at = at.anchor;
        } else {
          var [, end] = Range.edges(at);
          var pointRef = Editor.pointRef(editor, end);
          Transforms.delete(editor, {
            at
          });
          at = pointRef.unref();
        }
      }

      if (Point.isPoint(at)) {
        if (match == null) {
          if (Text.isText(node)) {
            match = n => Text.isText(n);
          } else if (editor.isInline(node)) {
            match = n => Text.isText(n) || Editor.isInline(editor, n);
          } else {
            match = n => Editor.isBlock(editor, n);
          }
        }

        var [entry] = Editor.nodes(editor, {
          at: at.path,
          match,
          mode,
          voids
        });

        if (entry) {
          var [, _matchPath] = entry;
          var pathRef = Editor.pathRef(editor, _matchPath);
          var isAtEnd = Editor.isEnd(editor, at, _matchPath);
          Transforms.splitNodes(editor, {
            at,
            match,
            mode,
            voids
          });
          var path = pathRef.unref();
          at = isAtEnd ? Path.next(path) : path;
        } else {
          return;
        }
      }

      var parentPath = Path.parent(at);
      var index = at[at.length - 1];

      if (!voids && Editor.void(editor, {
        at: parentPath
      })) {
        return;
      }

      for (var _node of nodes) {
        var _path = parentPath.concat(index);

        index++;
        editor.apply({
          type: 'insert_node',
          path: _path,
          node: _node
        });
        at = Path.next(at);
      }

      at = Path.previous(at);

      if (select) {
        var point = Editor.end(editor, at);

        if (point) {
          Transforms.select(editor, point);
        }
      }
    });
  },

  /**
   * Lift nodes at a specific location upwards in the document tree, splitting
   * their parent in two if necessary.
   */
  liftNodes(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        at = editor.selection,
        mode = 'lowest',
        voids = false
      } = options;
      var {
        match
      } = options;

      if (match == null) {
        match = Path.isPath(at) ? matchPath(editor, at) : n => Editor.isBlock(editor, n);
      }

      if (!at) {
        return;
      }

      var matches = Editor.nodes(editor, {
        at,
        match,
        mode,
        voids
      });
      var pathRefs = Array.from(matches, _ref => {
        var [, p] = _ref;
        return Editor.pathRef(editor, p);
      });

      for (var pathRef of pathRefs) {
        var path = pathRef.unref();

        if (path.length < 2) {
          throw new Error("Cannot lift node at a path [".concat(path, "] because it has a depth of less than `2`."));
        }

        var parentNodeEntry = Editor.node(editor, Path.parent(path));
        var [parent, parentPath] = parentNodeEntry;
        var index = path[path.length - 1];
        var {
          length
        } = parent.children;

        if (length === 1) {
          var toPath = Path.next(parentPath);
          Transforms.moveNodes(editor, {
            at: path,
            to: toPath,
            voids
          });
          Transforms.removeNodes(editor, {
            at: parentPath,
            voids
          });
        } else if (index === 0) {
          Transforms.moveNodes(editor, {
            at: path,
            to: parentPath,
            voids
          });
        } else if (index === length - 1) {
          var _toPath = Path.next(parentPath);

          Transforms.moveNodes(editor, {
            at: path,
            to: _toPath,
            voids
          });
        } else {
          var splitPath = Path.next(path);

          var _toPath2 = Path.next(parentPath);

          Transforms.splitNodes(editor, {
            at: splitPath,
            voids
          });
          Transforms.moveNodes(editor, {
            at: path,
            to: _toPath2,
            voids
          });
        }
      }
    });
  },

  /**
   * Merge a node at a location with the previous node of the same depth,
   * removing any empty containing nodes after the merge if necessary.
   */
  mergeNodes(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        match,
        at = editor.selection
      } = options;
      var {
        hanging = false,
        voids = false,
        mode = 'lowest'
      } = options;

      if (!at) {
        return;
      }

      if (match == null) {
        if (Path.isPath(at)) {
          var [parent] = Editor.parent(editor, at);

          match = n => parent.children.includes(n);
        } else {
          match = n => Editor.isBlock(editor, n);
        }
      }

      if (!hanging && Range.isRange(at)) {
        at = Editor.unhangRange(editor, at);
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor;
        } else {
          var [, end] = Range.edges(at);
          var pointRef = Editor.pointRef(editor, end);
          Transforms.delete(editor, {
            at
          });
          at = pointRef.unref();

          if (options.at == null) {
            Transforms.select(editor, at);
          }
        }
      }

      var [current] = Editor.nodes(editor, {
        at,
        match,
        voids,
        mode
      });
      var prev = Editor.previous(editor, {
        at,
        match,
        voids,
        mode
      });

      if (!current || !prev) {
        return;
      }

      var [node, path] = current;
      var [prevNode, prevPath] = prev;

      if (path.length === 0 || prevPath.length === 0) {
        return;
      }

      var newPath = Path.next(prevPath);
      var commonPath = Path.common(path, prevPath);
      var isPreviousSibling = Path.isSibling(path, prevPath);
      var levels = Array.from(Editor.levels(editor, {
        at: path
      }), _ref2 => {
        var [n] = _ref2;
        return n;
      }).slice(commonPath.length).slice(0, -1); // Determine if the merge will leave an ancestor of the path empty as a
      // result, in which case we'll want to remove it after merging.

      var emptyAncestor = Editor.above(editor, {
        at: path,
        mode: 'highest',
        match: n => levels.includes(n) && hasSingleChildNest(editor, n)
      });
      var emptyRef = emptyAncestor && Editor.pathRef(editor, emptyAncestor[1]);
      var properties;
      var position; // Ensure that the nodes are equivalent, and figure out what the position
      // and extra properties of the merge will be.

      if (Text.isText(node) && Text.isText(prevNode)) {
        var rest = _objectWithoutProperties(node, _excluded);

        position = prevNode.text.length;
        properties = rest;
      } else if (Element.isElement(node) && Element.isElement(prevNode)) {
        var rest = _objectWithoutProperties(node, _excluded2);

        position = prevNode.children.length;
        properties = rest;
      } else {
        throw new Error("Cannot merge the node at path [".concat(path, "] with the previous sibling because it is not the same kind: ").concat(Scrubber.stringify(node), " ").concat(Scrubber.stringify(prevNode)));
      } // If the node isn't already the next sibling of the previous node, move
      // it so that it is before merging.


      if (!isPreviousSibling) {
        Transforms.moveNodes(editor, {
          at: path,
          to: newPath,
          voids
        });
      } // If there was going to be an empty ancestor of the node that was merged,
      // we remove it from the tree.


      if (emptyRef) {
        Transforms.removeNodes(editor, {
          at: emptyRef.current,
          voids
        });
      } // If the target node that we're merging with is empty, remove it instead
      // of merging the two. This is a common rich text editor behavior to
      // prevent losing formatting when deleting entire nodes when you have a
      // hanging selection.
      // if prevNode is first child in parent,don't remove it.


      if (Element.isElement(prevNode) && Editor.isEmpty(editor, prevNode) || Text.isText(prevNode) && prevNode.text === '' && prevPath[prevPath.length - 1] !== 0) {
        Transforms.removeNodes(editor, {
          at: prevPath,
          voids
        });
      } else {
        editor.apply({
          type: 'merge_node',
          path: newPath,
          position,
          properties
        });
      }

      if (emptyRef) {
        emptyRef.unref();
      }
    });
  },

  /**
   * Move the nodes at a location to a new location.
   */
  moveNodes(editor, options) {
    Editor.withoutNormalizing(editor, () => {
      var {
        to,
        at = editor.selection,
        mode = 'lowest',
        voids = false
      } = options;
      var {
        match
      } = options;

      if (!at) {
        return;
      }

      if (match == null) {
        match = Path.isPath(at) ? matchPath(editor, at) : n => Editor.isBlock(editor, n);
      }

      var toRef = Editor.pathRef(editor, to);
      var targets = Editor.nodes(editor, {
        at,
        match,
        mode,
        voids
      });
      var pathRefs = Array.from(targets, _ref3 => {
        var [, p] = _ref3;
        return Editor.pathRef(editor, p);
      });

      for (var pathRef of pathRefs) {
        var path = pathRef.unref();
        var newPath = toRef.current;

        if (path.length !== 0) {
          editor.apply({
            type: 'move_node',
            path,
            newPath
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
  },

  /**
   * Remove the nodes at a specific location in the document.
   */
  removeNodes(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        hanging = false,
        voids = false,
        mode = 'lowest'
      } = options;
      var {
        at = editor.selection,
        match
      } = options;

      if (!at) {
        return;
      }

      if (match == null) {
        match = Path.isPath(at) ? matchPath(editor, at) : n => Editor.isBlock(editor, n);
      }

      if (!hanging && Range.isRange(at)) {
        at = Editor.unhangRange(editor, at);
      }

      var depths = Editor.nodes(editor, {
        at,
        match,
        mode,
        voids
      });
      var pathRefs = Array.from(depths, _ref4 => {
        var [, p] = _ref4;
        return Editor.pathRef(editor, p);
      });

      for (var pathRef of pathRefs) {
        var path = pathRef.unref();

        if (path) {
          var [node] = Editor.node(editor, path);
          editor.apply({
            type: 'remove_node',
            path,
            node
          });
        }
      }
    });
  },

  /**
   * Set new properties on the nodes at a location.
   */
  setNodes(editor, props) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        match,
        at = editor.selection,
        compare,
        merge
      } = options;
      var {
        hanging = false,
        mode = 'lowest',
        split = false,
        voids = false
      } = options;

      if (!at) {
        return;
      }

      if (match == null) {
        match = Path.isPath(at) ? matchPath(editor, at) : n => Editor.isBlock(editor, n);
      }

      if (!hanging && Range.isRange(at)) {
        at = Editor.unhangRange(editor, at);
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
        var [start, end] = Range.edges(at);
        var splitMode = mode === 'lowest' ? 'lowest' : 'highest';
        var endAtEndOfNode = Editor.isEnd(editor, end, end.path);
        Transforms.splitNodes(editor, {
          at: end,
          match,
          mode: splitMode,
          voids,
          always: !endAtEndOfNode
        });
        var startAtStartOfNode = Editor.isStart(editor, start, start.path);
        Transforms.splitNodes(editor, {
          at: start,
          match,
          mode: splitMode,
          voids,
          always: !startAtStartOfNode
        });
        at = rangeRef.unref();

        if (options.at == null) {
          Transforms.select(editor, at);
        }
      }

      if (!compare) {
        compare = (prop, nodeProp) => prop !== nodeProp;
      }

      for (var [node, path] of Editor.nodes(editor, {
        at,
        match,
        mode,
        voids
      })) {
        var properties = {};
        var newProperties = {}; // You can't set properties on the editor node.

        if (path.length === 0) {
          continue;
        }

        var hasChanges = false;

        for (var k in props) {
          if (k === 'children' || k === 'text') {
            continue;
          }

          if (compare(props[k], node[k])) {
            hasChanges = true; // Omit new properties from the old properties list

            if (node.hasOwnProperty(k)) properties[k] = node[k]; // Omit properties that have been removed from the new properties list

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
            path,
            properties,
            newProperties
          });
        }
      }
    });
  },

  /**
   * Split the nodes at a specific location.
   */
  splitNodes(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        mode = 'lowest',
        voids = false
      } = options;
      var {
        match,
        at = editor.selection,
        height = 0,
        always = false
      } = options;

      if (match == null) {
        match = n => Editor.isBlock(editor, n);
      }

      if (Range.isRange(at)) {
        at = deleteRange(editor, at);
      } // If the target is a path, the default height-skipping and position
      // counters need to account for us potentially splitting at a non-leaf.


      if (Path.isPath(at)) {
        var path = at;
        var point = Editor.point(editor, path);
        var [parent] = Editor.parent(editor, path);

        match = n => n === parent;

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
        var [highest] = Editor.nodes(editor, {
          at,
          match,
          mode,
          voids
        });

        if (!highest) {
          return;
        }

        var voidMatch = Editor.void(editor, {
          at,
          mode: 'highest'
        });
        var nudge = 0;

        if (!voids && voidMatch) {
          var [voidNode, voidPath] = voidMatch;

          if (Element.isElement(voidNode) && editor.isInline(voidNode)) {
            var after = Editor.after(editor, voidPath);

            if (!after) {
              var text = {
                text: ''
              };
              var afterPath = Path.next(voidPath);
              Transforms.insertNodes(editor, text, {
                at: afterPath,
                voids
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
        var [, highestPath] = highest;
        var lowestPath = at.path.slice(0, depth);
        var position = height === 0 ? at.offset : at.path[depth] + nudge;

        for (var [node, _path2] of Editor.levels(editor, {
          at: lowestPath,
          reverse: true,
          voids
        })) {
          var split = false;

          if (_path2.length < highestPath.length || _path2.length === 0 || !voids && Editor.isVoid(editor, node)) {
            break;
          }

          var _point = beforeRef.current;
          var isEnd = Editor.isEnd(editor, _point, _path2);

          if (always || !beforeRef || !Editor.isEdge(editor, _point, _path2)) {
            split = true;
            var properties = Node.extractProps(node);
            editor.apply({
              type: 'split_node',
              path: _path2,
              position,
              properties
            });
          }

          position = _path2[_path2.length - 1] + (split || isEnd ? 1 : 0);
        }

        if (options.at == null) {
          var _point2 = afterRef.current || Editor.end(editor, []);

          Transforms.select(editor, _point2);
        }
      } finally {
        var _afterRef;

        beforeRef.unref();
        (_afterRef = afterRef) === null || _afterRef === void 0 ? void 0 : _afterRef.unref();
      }
    });
  },

  /**
   * Unset properties on the nodes at a location.
   */
  unsetNodes(editor, props) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!Array.isArray(props)) {
      props = [props];
    }

    var obj = {};

    for (var key of props) {
      obj[key] = null;
    }

    Transforms.setNodes(editor, obj, options);
  },

  /**
   * Unwrap the nodes at a location from a parent node, splitting the parent if
   * necessary to ensure that only the content in the range is unwrapped.
   */
  unwrapNodes(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        mode = 'lowest',
        split = false,
        voids = false
      } = options;
      var {
        at = editor.selection,
        match
      } = options;

      if (!at) {
        return;
      }

      if (match == null) {
        match = Path.isPath(at) ? matchPath(editor, at) : n => Editor.isBlock(editor, n);
      }

      if (Path.isPath(at)) {
        at = Editor.range(editor, at);
      }

      var rangeRef = Range.isRange(at) ? Editor.rangeRef(editor, at) : null;
      var matches = Editor.nodes(editor, {
        at,
        match,
        mode,
        voids
      });
      var pathRefs = Array.from(matches, _ref5 => {
        var [, p] = _ref5;
        return Editor.pathRef(editor, p);
      } // unwrapNode will call liftNode which does not support splitting the node when nested.
      // If we do not reverse the order and call it from top to the bottom, it will remove all blocks
      // that wrap target node. So we reverse the order.
      ).reverse();

      var _loop = function _loop(pathRef) {
        var path = pathRef.unref();
        var [node] = Editor.node(editor, path);
        var range = Editor.range(editor, path);

        if (split && rangeRef) {
          range = Range.intersection(rangeRef.current, range);
        }

        Transforms.liftNodes(editor, {
          at: range,
          match: n => Element.isAncestor(node) && node.children.includes(n),
          voids
        });
      };

      for (var pathRef of pathRefs) {
        _loop(pathRef);
      }

      if (rangeRef) {
        rangeRef.unref();
      }
    });
  },

  /**
   * Wrap the nodes at a location in a new container node, splitting the edges
   * of the range first to ensure that only the content in the range is wrapped.
   */
  wrapNodes(editor, element) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        mode = 'lowest',
        split = false,
        voids = false
      } = options;
      var {
        match,
        at = editor.selection
      } = options;

      if (!at) {
        return;
      }

      if (match == null) {
        if (Path.isPath(at)) {
          match = matchPath(editor, at);
        } else if (editor.isInline(element)) {
          match = n => Editor.isInline(editor, n) || Text.isText(n);
        } else {
          match = n => Editor.isBlock(editor, n);
        }
      }

      if (split && Range.isRange(at)) {
        var [start, end] = Range.edges(at);
        var rangeRef = Editor.rangeRef(editor, at, {
          affinity: 'inward'
        });
        Transforms.splitNodes(editor, {
          at: end,
          match,
          voids
        });
        Transforms.splitNodes(editor, {
          at: start,
          match,
          voids
        });
        at = rangeRef.unref();

        if (options.at == null) {
          Transforms.select(editor, at);
        }
      }

      var roots = Array.from(Editor.nodes(editor, {
        at,
        match: editor.isInline(element) ? n => Editor.isBlock(editor, n) : n => Editor.isEditor(n),
        mode: 'lowest',
        voids
      }));

      for (var [, rootPath] of roots) {
        var a = Range.isRange(at) ? Range.intersection(at, Editor.range(editor, rootPath)) : at;

        if (!a) {
          continue;
        }

        var matches = Array.from(Editor.nodes(editor, {
          at: a,
          match,
          mode,
          voids
        }));

        if (matches.length > 0) {
          var _ret = function () {
            var [first] = matches;
            var last = matches[matches.length - 1];
            var [, firstPath] = first;
            var [, lastPath] = last;

            if (firstPath.length === 0 && lastPath.length === 0) {
              // if there's no matching parent - usually means the node is an editor - don't do anything
              return "continue";
            }

            var commonPath = Path.equals(firstPath, lastPath) ? Path.parent(firstPath) : Path.common(firstPath, lastPath);
            var range = Editor.range(editor, firstPath, lastPath);
            var commonNodeEntry = Editor.node(editor, commonPath);
            var [commonNode] = commonNodeEntry;
            var depth = commonPath.length + 1;
            var wrapperPath = Path.next(lastPath.slice(0, depth));

            var wrapper = _objectSpread$2(_objectSpread$2({}, element), {}, {
              children: []
            });

            Transforms.insertNodes(editor, wrapper, {
              at: wrapperPath,
              voids
            });
            Transforms.moveNodes(editor, {
              at: range,
              match: n => Element.isAncestor(commonNode) && commonNode.children.includes(n),
              to: wrapperPath.concat(0),
              voids
            });
          }();

          if (_ret === "continue") continue;
        }
      }
    });
  }

};

var hasSingleChildNest = (editor, node) => {
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
/**
 * Convert a range into a point by deleting it's content.
 */


var deleteRange = (editor, range) => {
  if (Range.isCollapsed(range)) {
    return range.anchor;
  } else {
    var [, end] = Range.edges(range);
    var pointRef = Editor.pointRef(editor, end);
    Transforms.delete(editor, {
      at: range
    });
    return pointRef.unref();
  }
};

var matchPath = (editor, path) => {
  var [node] = Editor.node(editor, path);
  return n => n === node;
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var SelectionTransforms = {
  /**
   * Collapse the selection.
   */
  collapse(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      edge = 'anchor'
    } = options;
    var {
      selection
    } = editor;

    if (!selection) {
      return;
    } else if (edge === 'anchor') {
      Transforms.select(editor, selection.anchor);
    } else if (edge === 'focus') {
      Transforms.select(editor, selection.focus);
    } else if (edge === 'start') {
      var [start] = Range.edges(selection);
      Transforms.select(editor, start);
    } else if (edge === 'end') {
      var [, end] = Range.edges(selection);
      Transforms.select(editor, end);
    }
  },

  /**
   * Unset the selection.
   */
  deselect(editor) {
    var {
      selection
    } = editor;

    if (selection) {
      editor.apply({
        type: 'set_selection',
        properties: selection,
        newProperties: null
      });
    }
  },

  /**
   * Move the selection's point forward or backward.
   */
  move(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var {
      selection
    } = editor;
    var {
      distance = 1,
      unit = 'character',
      reverse = false
    } = options;
    var {
      edge = null
    } = options;

    if (!selection) {
      return;
    }

    if (edge === 'start') {
      edge = Range.isBackward(selection) ? 'focus' : 'anchor';
    }

    if (edge === 'end') {
      edge = Range.isBackward(selection) ? 'anchor' : 'focus';
    }

    var {
      anchor,
      focus
    } = selection;
    var opts = {
      distance,
      unit
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
  },

  /**
   * Set the selection to a new value.
   */
  select(editor, target) {
    var {
      selection
    } = editor;
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
  },

  /**
   * Set new properties on one of the selection's points.
   */
  setPoint(editor, props) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var {
      selection
    } = editor;
    var {
      edge = 'both'
    } = options;

    if (!selection) {
      return;
    }

    if (edge === 'start') {
      edge = Range.isBackward(selection) ? 'focus' : 'anchor';
    }

    if (edge === 'end') {
      edge = Range.isBackward(selection) ? 'anchor' : 'focus';
    }

    var {
      anchor,
      focus
    } = selection;
    var point = edge === 'anchor' ? anchor : focus;
    Transforms.setSelection(editor, {
      [edge === 'anchor' ? 'anchor' : 'focus']: _objectSpread$1(_objectSpread$1({}, point), props)
    });
  },

  /**
   * Set new properties on the selection.
   */
  setSelection(editor, props) {
    var {
      selection
    } = editor;
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
  }

};

var TextTransforms = {
  /**
   * Delete content in the editor.
   */
  delete(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        reverse = false,
        unit = 'character',
        distance = 1,
        voids = false
      } = options;
      var {
        at = editor.selection,
        hanging = false
      } = options;

      if (!at) {
        return;
      }

      var isCollapsed = false;

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        isCollapsed = true;
        at = at.anchor;
      }

      if (Point.isPoint(at)) {
        var furthestVoid = Editor.void(editor, {
          at,
          mode: 'highest'
        });

        if (!voids && furthestVoid) {
          var [, voidPath] = furthestVoid;
          at = voidPath;
        } else {
          var opts = {
            unit,
            distance
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
          at,
          voids
        });
        return;
      }

      if (Range.isCollapsed(at)) {
        return;
      }

      if (!hanging) {
        var [, _end] = Range.edges(at);
        var endOfDoc = Editor.end(editor, []);

        if (!Point.equals(_end, endOfDoc)) {
          at = Editor.unhangRange(editor, at, {
            voids
          });
        }
      }

      var [start, end] = Range.edges(at);
      var startBlock = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
        at: start,
        voids
      });
      var endBlock = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
        at: end,
        voids
      });
      var isAcrossBlocks = startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1]);
      var isSingleText = Path.equals(start.path, end.path);
      var startVoid = voids ? null : Editor.void(editor, {
        at: start,
        mode: 'highest'
      });
      var endVoid = voids ? null : Editor.void(editor, {
        at: end,
        mode: 'highest'
      }); // If the start or end points are inside an inline void, nudge them out.

      if (startVoid) {
        var before = Editor.before(editor, start);

        if (before && startBlock && Path.isAncestor(startBlock[1], before.path)) {
          start = before;
        }
      }

      if (endVoid) {
        var after = Editor.after(editor, end);

        if (after && endBlock && Path.isAncestor(endBlock[1], after.path)) {
          end = after;
        }
      } // Get the highest nodes that are completely inside the range, as well as
      // the start and end nodes.


      var matches = [];
      var lastPath;

      for (var entry of Editor.nodes(editor, {
        at,
        voids
      })) {
        var [node, path] = entry;

        if (lastPath && Path.compare(path, lastPath) === 0) {
          continue;
        }

        if (!voids && Editor.isVoid(editor, node) || !Path.isCommon(path, start.path) && !Path.isCommon(path, end.path)) {
          matches.push(entry);
          lastPath = path;
        }
      }

      var pathRefs = Array.from(matches, _ref => {
        var [, p] = _ref;
        return Editor.pathRef(editor, p);
      });
      var startRef = Editor.pointRef(editor, start);
      var endRef = Editor.pointRef(editor, end);
      var removedText = '';

      if (!isSingleText && !startVoid) {
        var _point = startRef.current;
        var [_node] = Editor.leaf(editor, _point);
        var {
          path: _path
        } = _point;
        var {
          offset
        } = start;

        var text = _node.text.slice(offset);

        if (text.length > 0) {
          editor.apply({
            type: 'remove_text',
            path: _path,
            offset,
            text
          });
          removedText = text;
        }
      }

      for (var pathRef of pathRefs) {
        var _path2 = pathRef.unref();

        Transforms.removeNodes(editor, {
          at: _path2,
          voids
        });
      }

      if (!endVoid) {
        var _point2 = endRef.current;
        var [_node2] = Editor.leaf(editor, _point2);
        var {
          path: _path3
        } = _point2;

        var _offset = isSingleText ? start.offset : 0;

        var _text = _node2.text.slice(_offset, end.offset);

        if (_text.length > 0) {
          editor.apply({
            type: 'remove_text',
            path: _path3,
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
          voids
        });
      } // For Thai script, deleting N character(s) backward should delete
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
  },

  /**
   * Insert a fragment at a specific location in the editor.
   */
  insertFragment(editor, fragment) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        hanging = false,
        voids = false
      } = options;
      var {
        at = editor.selection
      } = options;

      if (!fragment.length) {
        return;
      }

      if (!at) {
        return;
      } else if (Range.isRange(at)) {
        if (!hanging) {
          at = Editor.unhangRange(editor, at);
        }

        if (Range.isCollapsed(at)) {
          at = at.anchor;
        } else {
          var [, end] = Range.edges(at);

          if (!voids && Editor.void(editor, {
            at: end
          })) {
            return;
          }

          var pointRef = Editor.pointRef(editor, end);
          Transforms.delete(editor, {
            at
          });
          at = pointRef.unref();
        }
      } else if (Path.isPath(at)) {
        at = Editor.start(editor, at);
      }

      if (!voids && Editor.void(editor, {
        at
      })) {
        return;
      } // If the insert point is at the edge of an inline node, move it outside
      // instead since it will need to be split otherwise.


      var inlineElementMatch = Editor.above(editor, {
        at,
        match: n => Editor.isInline(editor, n),
        mode: 'highest',
        voids
      });

      if (inlineElementMatch) {
        var [, _inlinePath] = inlineElementMatch;

        if (Editor.isEnd(editor, at, _inlinePath)) {
          var after = Editor.after(editor, _inlinePath);
          at = after;
        } else if (Editor.isStart(editor, at, _inlinePath)) {
          var before = Editor.before(editor, _inlinePath);
          at = before;
        }
      }

      var blockMatch = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
        at,
        voids
      });
      var [, blockPath] = blockMatch;
      var isBlockStart = Editor.isStart(editor, at, blockPath);
      var isBlockEnd = Editor.isEnd(editor, at, blockPath);
      var isBlockEmpty = isBlockStart && isBlockEnd;
      var mergeStart = !isBlockStart || isBlockStart && isBlockEnd;
      var mergeEnd = !isBlockEnd;
      var [, firstPath] = Node.first({
        children: fragment
      }, []);
      var [, lastPath] = Node.last({
        children: fragment
      }, []);
      var matches = [];

      var matcher = _ref2 => {
        var [n, p] = _ref2;
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

      for (var entry of Node.nodes({
        children: fragment
      }, {
        pass: matcher
      })) {
        if (matcher(entry)) {
          matches.push(entry);
        }
      }

      var starts = [];
      var middles = [];
      var ends = [];
      var starting = true;
      var hasBlocks = false;

      for (var [node] of matches) {
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

      var [inlineMatch] = Editor.nodes(editor, {
        at,
        match: n => Text.isText(n) || Editor.isInline(editor, n),
        mode: 'highest',
        voids
      });
      var [, inlinePath] = inlineMatch;
      var isInlineStart = Editor.isStart(editor, at, inlinePath);
      var isInlineEnd = Editor.isEnd(editor, at, inlinePath);
      var middleRef = Editor.pathRef(editor, isBlockEnd ? Path.next(blockPath) : blockPath);
      var endRef = Editor.pathRef(editor, isInlineEnd ? Path.next(inlinePath) : inlinePath);
      var blockPathRef = Editor.pathRef(editor, blockPath);
      Transforms.splitNodes(editor, {
        at,
        match: n => hasBlocks ? Editor.isBlock(editor, n) : Text.isText(n) || Editor.isInline(editor, n),
        mode: hasBlocks ? 'lowest' : 'highest',
        voids
      });
      var startRef = Editor.pathRef(editor, !isInlineStart || isInlineStart && isInlineEnd ? Path.next(inlinePath) : inlinePath);
      Transforms.insertNodes(editor, starts, {
        at: startRef.current,
        match: n => Text.isText(n) || Editor.isInline(editor, n),
        mode: 'highest',
        voids
      });

      if (isBlockEmpty && middles.length) {
        Transforms.delete(editor, {
          at: blockPathRef.unref(),
          voids
        });
      }

      Transforms.insertNodes(editor, middles, {
        at: middleRef.current,
        match: n => Editor.isBlock(editor, n),
        mode: 'lowest',
        voids
      });
      Transforms.insertNodes(editor, ends, {
        at: endRef.current,
        match: n => Text.isText(n) || Editor.isInline(editor, n),
        mode: 'highest',
        voids
      });

      if (!options.at) {
        var path;

        if (ends.length > 0) {
          path = Path.previous(endRef.current);
        } else if (middles.length > 0) {
          path = Path.previous(middleRef.current);
        } else {
          path = Path.previous(startRef.current);
        }

        var _end2 = Editor.end(editor, path);

        Transforms.select(editor, _end2);
      }

      startRef.unref();
      middleRef.unref();
      endRef.unref();
    });
  },

  /**
   * Insert a string of text in the Editor.
   */
  insertText(editor, text) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    Editor.withoutNormalizing(editor, () => {
      var {
        voids = false
      } = options;
      var {
        at = editor.selection
      } = options;

      if (!at) {
        return;
      }

      if (Path.isPath(at)) {
        at = Editor.range(editor, at);
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor;
        } else {
          var end = Range.end(at);

          if (!voids && Editor.void(editor, {
            at: end
          })) {
            return;
          }

          var start = Range.start(at);
          var startRef = Editor.pointRef(editor, start);
          var endRef = Editor.pointRef(editor, end);
          Transforms.delete(editor, {
            at,
            voids
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

      if (!voids && Editor.void(editor, {
        at
      })) {
        return;
      }

      var {
        path,
        offset
      } = at;
      if (text.length > 0) editor.apply({
        type: 'insert_text',
        path,
        offset,
        text
      });
    });
  }

};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var Transforms = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, GeneralTransforms), NodeTransforms), SelectionTransforms), TextTransforms);

export { Editor, Element, Location, Node, Operation, Path, PathRef, Point, PointRef, Range, RangeRef, Scrubber, Span, Text, Transforms, createEditor };
//# sourceMappingURL=index.es.js.map
