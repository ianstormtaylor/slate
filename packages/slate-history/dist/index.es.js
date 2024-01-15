import { isPlainObject } from 'is-plain-object';
import { Operation, Editor, Transforms, Path } from 'slate';

// eslint-disable-next-line no-redeclare
var History = {
  /**
   * Check if a value is a `History` object.
   */
  isHistory(value) {
    return isPlainObject(value) && Array.isArray(value.redos) && Array.isArray(value.undos) && (value.redos.length === 0 || Operation.isOperationList(value.redos[0].operations)) && (value.undos.length === 0 || Operation.isOperationList(value.undos[0].operations));
  }
};

/**
 * Weakmaps for attaching state to the editor.
 */
var HISTORY = new WeakMap();
var SAVING = new WeakMap();
var MERGING = new WeakMap();
// eslint-disable-next-line no-redeclare
var HistoryEditor = {
  /**
   * Check if a value is a `HistoryEditor` object.
   */
  isHistoryEditor(value) {
    return History.isHistory(value.history) && Editor.isEditor(value);
  },
  /**
   * Get the merge flag's current value.
   */
  isMerging(editor) {
    return MERGING.get(editor);
  },
  /**
   * Get the saving flag's current value.
   */
  isSaving(editor) {
    return SAVING.get(editor);
  },
  /**
   * Redo to the previous saved state.
   */
  redo(editor) {
    editor.redo();
  },
  /**
   * Undo to the previous saved state.
   */
  undo(editor) {
    editor.undo();
  },
  /**
   * Apply a series of changes inside a synchronous `fn`, without merging any of
   * the new operations into previous save point in the history.
   */
  withoutMerging(editor, fn) {
    var prev = HistoryEditor.isMerging(editor);
    MERGING.set(editor, false);
    fn();
    MERGING.set(editor, prev);
  },
  /**
   * Apply a series of changes inside a synchronous `fn`, without saving any of
   * their operations into the history.
   */
  withoutSaving(editor, fn) {
    var prev = HistoryEditor.isSaving(editor);
    SAVING.set(editor, false);
    fn();
    SAVING.set(editor, prev);
  }
};

/**
 * The `withHistory` plugin keeps track of the operation history of a Slate
 * editor as operations are applied to it, using undo and redo stacks.
 *
 * If you are using TypeScript, you must extend Slate's CustomTypes to use
 * this plugin.
 *
 * See https://docs.slatejs.org/concepts/11-typescript to learn how.
 */
var withHistory = editor => {
  var e = editor;
  var {
    apply
  } = e;
  e.history = {
    undos: [],
    redos: []
  };
  e.redo = () => {
    var {
      history
    } = e;
    var {
      redos
    } = history;
    if (redos.length > 0) {
      var batch = redos[redos.length - 1];
      if (batch.selectionBefore) {
        Transforms.setSelection(e, batch.selectionBefore);
      }
      HistoryEditor.withoutSaving(e, () => {
        Editor.withoutNormalizing(e, () => {
          for (var op of batch.operations) {
            e.apply(op);
          }
        });
      });
      history.redos.pop();
      e.writeHistory('undos', batch);
    }
  };
  e.undo = () => {
    var {
      history
    } = e;
    var {
      undos
    } = history;
    if (undos.length > 0) {
      var batch = undos[undos.length - 1];
      HistoryEditor.withoutSaving(e, () => {
        Editor.withoutNormalizing(e, () => {
          var inverseOps = batch.operations.map(Operation.inverse).reverse();
          for (var op of inverseOps) {
            e.apply(op);
          }
          if (batch.selectionBefore) {
            Transforms.setSelection(e, batch.selectionBefore);
          }
        });
      });
      e.writeHistory('redos', batch);
      history.undos.pop();
    }
  };
  e.apply = op => {
    var {
      operations,
      history
    } = e;
    var {
      undos
    } = history;
    var lastBatch = undos[undos.length - 1];
    var lastOp = lastBatch && lastBatch.operations[lastBatch.operations.length - 1];
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
          merge = shouldMerge(op, lastOp);
        }
      }
      if (lastBatch && merge) {
        lastBatch.operations.push(op);
      } else {
        var batch = {
          operations: [op],
          selectionBefore: e.selection
        };
        e.writeHistory('undos', batch);
      }
      while (undos.length > 100) {
        undos.shift();
      }
      history.redos = [];
    }
    apply(op);
  };
  e.writeHistory = (stack, batch) => {
    e.history[stack].push(batch);
  };
  return e;
};
/**
 * Check whether to merge an operation into the previous operation.
 */
var shouldMerge = (op, prev) => {
  if (prev && op.type === 'insert_text' && prev.type === 'insert_text' && op.offset === prev.offset + prev.text.length && Path.equals(op.path, prev.path)) {
    return true;
  }
  if (prev && op.type === 'remove_text' && prev.type === 'remove_text' && op.offset + op.text.length === prev.offset && Path.equals(op.path, prev.path)) {
    return true;
  }
  return false;
};
/**
 * Check whether an operation needs to be saved to the history.
 */
var shouldSave = (op, prev) => {
  if (op.type === 'set_selection') {
    return false;
  }
  return true;
};

export { HISTORY, History, HistoryEditor, MERGING, SAVING, withHistory };
//# sourceMappingURL=index.es.js.map
