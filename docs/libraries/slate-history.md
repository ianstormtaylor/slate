# Slate History

This sub-library contains the core logic of Slate.

## `History`

`History` objects hold all of the operations that are applied to a value, so they can be undone or redone as necessary.

## `HistoryEditor`

`HistoryEditor` contains helpers for history-enabled editors.

## `withHistory`

The `withHistory` plugin keeps track of the operation history of a Slate editor as operations are applied to it, using undo and redo stacks.
