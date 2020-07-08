'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(require('is-plain-object'));
var slate = require('slate');

var History = {
  /**
   * Check if a value is a `History` object.
   */
  isHistory: function isHistory(value) {
    return isPlainObject(value) && Array.isArray(value.redos) && Array.isArray(value.undos) && (value.redos.length === 0 || slate.Operation.isOperationList(value.redos[0])) && (value.undos.length === 0 || slate.Operation.isOperationList(value.undos[0]));
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
    return slate.Editor.isEditor(value) && History.isHistory(value.history);
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

/**
 * The `withHistory` plugin keeps track of the operation history of a Slate
 * editor as operations are applied to it, using undo and redo stacks.
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
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = batch[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var op = _step.value;
              e.apply(op);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
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
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = inverseOps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var op = _step2.value;

              // If the final operation is deselecting the editor, skip it. This is
              if (op === inverseOps[inverseOps.length - 1] && op.type === 'set_selection' && op.newProperties == null) {
                continue;
              } else {
                e.apply(op);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
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
  if (op.type === 'set_selection' && op.newProperties == null) {
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
