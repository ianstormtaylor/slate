# `slate-history`

```js
import {
  withHistory,
  History,
  HistoryEditor,
  HistoryCommand,
} from 'slate-history'
```

A plugin for Slate editors that adds a history stack for undoing and redoing changes.

## Example

```js
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

// Create an editor and use the history plugin.
const editor = withHistory(createEditor())

// Later, when you want to undo or redo changes...
editor.exec({ type: 'undo' })
editor.exec({ type: 'redo' })
```

## Exports

### `withHistory`

`withHistory(editor: Editor) => Editor`

Augments a Slate editor with a history stack.

### `History`

`Object`

A set of helpers for working with `History` objects.

### `HistoryEditor`

`Object`

A set of helpers for working with history `Editor` objects.

### `HistoryCommand`

`Object`

A set of helpers for working with history `Command` objects.
