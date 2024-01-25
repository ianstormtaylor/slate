'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isPlainObject = require('is-plain-object');
var slate = require('slate');

var History = {
  /**
   * Check if a value is a `History` object.
   */
  isHistory: function isHistory(value) {
    return isPlainObject.isPlainObject(value) && Array.isArray(value.redos) && Array.isArray(value.undos) && (value.redos.length === 0 || slate.Operation.isOperationList(value.redos[0])) && (value.undos.length === 0 || slate.Operation.isOperationList(value.undos[0]));
  }
};

/**
 * Weakmaps for attaching state to the editor.
 */

var HISTORY = new WeakMap();
var SAVING = new WeakMap();
var MERGING = new WeakMap();
var HistoryEditor = {
  /**
   * Check if a value is a `HistoryEditor` object.
   */
  isHistoryEditor: function isHistoryEditor(value) {
    return History.isHistory(value.history) && slate.Editor.isEditor(value);
  },

  /**
   * Get the merge flag's current value.
   */
  isMerging: function isMerging(editor) {
    return MERGING.get(editor);
  },

  /**
   * Get the saving flag's current value.
   */
  isSaving: function isSaving(editor) {
    return SAVING.get(editor);
  },

  /**
   * Redo to the previous saved state.
   */
  redo: function redo(editor) {
    editor.redo();
  },

  /**
   * Undo to the previous saved state.
   */
  undo: function undo(editor) {
    editor.undo();
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, without merging any of
   * the new operations into previous save point in the history.
   */
  withoutMerging: function withoutMerging(editor, fn) {
    var prev = HistoryEditor.isMerging(editor);
    MERGING.set(editor, false);
    fn();
    MERGING.set(editor, prev);
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, without saving any of
   * their operations into the history.
   */
  withoutSaving: function withoutSaving(editor, fn) {
    var prev = HistoryEditor.isSaving(editor);
    SAVING.set(editor, false);
    fn();
    SAVING.set(editor, prev);
  }
};

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * The `withHistory` plugin keeps track of the operation history of a Slate
 * editor as operations are applied to it, using undo and redo stacks.
 *
 * If you are using TypeScript, you must extend Slate's CustomTypes to use
 * this plugin.
 *
 * See https://docs.slatejs.org/concepts/11-typescript to learn how.
 */

var withHistory = function withHistory(editor) {
  var e = editor;
  var apply = e.apply;
  e.history = {
    undos: [],
    redos: []
  };

  e.redo = function () {
    var history = e.history;
    var redos = history.redos;

    if (redos.length > 0) {
      var batch = redos[redos.length - 1];
      HistoryEditor.withoutSaving(e, function () {
        slate.Editor.withoutNormalizing(e, function () {
          var _iterator = _createForOfIteratorHelper(batch),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var op = _step.value;
              e.apply(op);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        });
      });
      history.redos.pop();
      history.undos.push(batch);
    }
  };

  e.undo = function () {
    var history = e.history;
    var undos = history.undos;

    if (undos.length > 0) {
      var batch = undos[undos.length - 1];
      HistoryEditor.withoutSaving(e, function () {
        slate.Editor.withoutNormalizing(e, function () {
          var inverseOps = batch.map(slate.Operation.inverse).reverse();

          var _iterator2 = _createForOfIteratorHelper(inverseOps),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var op = _step2.value;
              e.apply(op);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        });
      });
      history.redos.push(batch);
      history.undos.pop();
    }
  };

  e.apply = function (op) {
    var operations = e.operations,
        history = e.history;
    var undos = history.undos;
    var lastBatch = undos[undos.length - 1];
    var lastOp = lastBatch && lastBatch[lastBatch.length - 1];
    var overwrite = shouldOverwrite(op, lastOp);
    var save = HistoryEditor.isSaving(e);
    var merge = HistoryEditor.isMerging(e);

    if (save == null) {
      save = shouldSave(op);
    }

    if (save) {
      if (merge == null) {
        if (lastBatch == null) {
          merge = false;
        } else if (operations.length !== 0) {
          merge = true;
        } else {
          merge = shouldMerge(op, lastOp) || overwrite;
        }
      }

      if (lastBatch && merge) {
        if (overwrite) {
          lastBatch.pop();
        }

        lastBatch.push(op);
      } else {
        var batch = [op];
        undos.push(batch);
      }

      while (undos.length > 100) {
        undos.shift();
      }

      if (shouldClear(op)) {
        history.redos = [];
      }
    }

    apply(op);
  };

  return e;
};
/**
 * Check whether to merge an operation into the previous operation.
 */

var shouldMerge = function shouldMerge(op, prev) {
  if (op.type === 'set_selection') {
    return true;
  }

  if (prev && op.type === 'insert_text' && prev.type === 'insert_text' && op.offset === prev.offset + prev.text.length && slate.Path.equals(op.path, prev.path)) {
    return true;
  }

  if (prev && op.type === 'remove_text' && prev.type === 'remove_text' && op.offset + op.text.length === prev.offset && slate.Path.equals(op.path, prev.path)) {
    return true;
  }

  return false;
};
/**
 * Check whether an operation needs to be saved to the history.
 */


var shouldSave = function shouldSave(op, prev) {
  if (op.type === 'set_selection' && (op.properties == null || op.newProperties == null)) {
    return false;
  }

  return true;
};
/**
 * Check whether an operation should overwrite the previous one.
 */


var shouldOverwrite = function shouldOverwrite(op, prev) {
  if (prev && op.type === 'set_selection' && prev.type === 'set_selection') {
    return true;
  }

  return false;
};
/**
 * Check whether an operation should clear the redos stack.
 */


var shouldClear = function shouldClear(op) {
  if (op.type === 'set_selection') {
    return false;
  }

  return true;
};

exports.HISTORY = HISTORY;
exports.History = History;
exports.HistoryEditor = HistoryEditor;
exports.MERGING = MERGING;
exports.SAVING = SAVING;
exports.withHistory = withHistory;
//# sourceMappingURL=index.js.map
