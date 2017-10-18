
# Changes

All changes to a Slate editor's state, whether it's the `selection`, `document`, `history`, etc. happen via "changes"—specifically, via the [`Change`](../reference/slate/change.md) model.

This is important because the `Change` model is responsible for ensuring that every change to a Slate state can be expressed in terms of low-level [operations](./operation.md).

Slate changing any state in the editor via a series of "change" methods.


