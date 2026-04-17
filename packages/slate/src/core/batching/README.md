# Batching shape

Batching preserves `editor.apply(op)` as the plugin seam. Public callers use
`Editor.withBatch` or `Transforms.applyBatch`; optimized paths stay private.

Fast paths are intentionally narrow:

- exact `set_node` batches
- text leaf batches
- same-parent `insert_node`
- same-parent `insert_node` plus `move_node`
- same-parent `move_node`

`split_node` and `merge_node` have draft/dirty-path support only so deferred
normalization stays replay-equivalent when later operations observe the split or
merged shape. They are not required performance lanes.

Mixed batches may split into the fast families above, but unsupported segments
stay on the normal apply path. Committed `editor.children` stays isolated from
draft state until the batch commits, so previously observed nodes are not made
mutable as part of the public contract.
