# Core property tests

`yarn test` includes this suite with seed `20261014` and 100 runs per property. `yarn test:fuzz` runs the same 41 properties 5,000 times each, with a longer Mocha timeout. fast-check shrinks failures and prints the seed, replay path and counterexample.

To replay a failure, select its property and pass the reported seed and path:

```sh
SLATE_FUZZ_SEED=20261014 SLATE_FUZZ_PATH='0:1' yarn test:fuzz --grep 'normalization is idempotent'
```

For a different run count or seed:

```sh
SLATE_FUZZ_RUNS=10000 SLATE_FUZZ_SEED=42 yarn test:fuzz
```

## Domains and contracts

Default documents are bounded to four top-level blocks, a container level, inline elements and voids. The fuzz profile raises those limits to six root blocks and three container levels. Text includes ASCII, accented characters, a surrogate pair and a combining sequence. Text marks include optional booleans, IDs and nested JSON data. The normalization generator also supplies empty elements, adjacent text nodes and mixed block/inline content, including invalid top-level text.

Each of the nine operation types has its own document-and-selection inverse property. Operation payloads come from the current tree: removed text and nodes match their source, merge positions and properties match the preceding node, split properties match the source, and moves cannot target their own descendants. Separate generated sequences recompute valid operations after each step.

Raw operation and ref checks disable automatic normalization. An inverse cannot undo extra operations performed by a normalizer. The separate normalization property checks idempotence, no changes on a second pass, nonempty elements, compatible inline/block children, text around inline elements, and no adjacent empty or equal-mark texts.

Selection inverse properties use surviving, unambiguous points. Removing text or a node destroys position information inside it; re-inserting it cannot recover an old selection. The closed removed-text interval and both representations of a text merge seam are excluded from inverse assertions. Merged node paths also lose their separate node identities, so the path inverse check excludes those two exact paths. These exclusions are computed from the original operation, never by filtering for a successful transform result. Refs still test all these cases, including null affinities and removal, and must release their registrations.

Character positions are grapheme positions, not every UTF-16 offset. The string/position property compares against independently segmented block strings using `Intl.Segmenter`, checks strictly increasing points and their exact offsets, and checks reverse traversal by text-prefix positions. Distinct leaf endpoints can represent the same block offset when walking in opposite directions. It uses `voids: true` so hidden void text is included consistently by both string APIs.

Loose text equality is checked against Lodash's deep comparison of independently extracted marks. Generators never produce explicit `undefined` property values. Slate's equality treats them as missing keys, and `merge_node` and `set_node` inverses can drop them, so the strict round-trip checks would report differences JSON cannot represent. Equal nested values are cloned to avoid checking only shared object identities.

## High-level transforms and history

Fifteen properties apply normalized high-level transforms with valid generated points, ranges and paths: delete, insertText, insertFragment, insertNodes, splitNodes, mergeNodes, inline/block wrap and unwrap, liftNodes, moveNodes, setNodes, unsetNodes and removeNodes. Deletion varies character/word/line/block units, distance and direction. Expanded deletion uses `hanging: true`; collapsed ranges use point deletion rather than an empty-range string oracle. String checks preserve the unaffected prefix/suffix, or all text for structural transforms. Point deletion protects root blocks outside the target and its immediate neighbors to allow void and empty-inline behavior.

Three history properties execute one to ten transforms under default history, `withNewBatch`, or a mix of `withoutMerging` for single-operation transforms and `withNewBatch` for compound transforms. The single-operation classification is computed from the operation and its arguments before execution: root moves/inserts/removals, point text insertion and element metadata updates. An assertion checks that classified calls actually emit at most one saved operation; normalization operations count too. Empty documents are repaired with one root insertion before subsequent commands.

Documents must match the starting and ending snapshots after undoing and redoing every batch. Undo restores the first saved batch's selection. Redo starts from the final batch's `selectionBefore` and transforms it through its saved operations with forward affinity, checking equality when those points survive; standalone selection changes are not history entries. Every final selection must resolve to valid text offsets. This selection oracle tests history wiring, not an independent implementation of point transformation.

Seven position properties cover word, line and block with both void modes, plus character with `voids: false`. Each direction is strictly ordered and agrees with `after` or `before` for consecutive positions. Forward and reverse word boundaries need not coincide. A sample custom normalizer converts paragraphs containing exactly "x" into `x-para`, then checks termination, structural invariants and an operation-free second normalization.

## Regressions and deferred contracts

`regressions.spec.ts` retains plain regressions for fragment replacement through voids and block-leading inlines, history restoring saved selections from null, and directional traversal through inline voids. The leading-inline cases cover both range directions and whether a preceding block exists; insertion must remain in its own block. A deep-container case also covers the trailing inline while the document temporarily ends in emptied containers.

Text-conserving generated merges use adjacent sibling elements with compatible child modes: both have block children, or both have text/inline children. An additional generated property constructs incompatible sibling pairs in both directions and checks that they throw without changing the document, selection, operations or registered refs. Plain regressions also cover inline children, a non-sibling target, empty sides, text-node merging and the previous-node removal policy.

Compound `withoutMerging` undo is tracked in [issue #6302](https://github.com/ianstormtaylor/slate/issues/6302). Its normalization operations become independent undo steps, which can invalidate later inverse paths. The history suite uses `withNewBatch` for those operations as directed. The separate per-operation deletion selection mismatch remains reproducible in the maintenance review package, with its own executable plain repro, failing output and cause; it is not treated as a passing history contract. Slate-history implementation is unchanged by this follow-up.

## Scope

The fixed seed is a reproducible regression sample, not exhaustive coverage. Documents and sequences are deliberately small; sequences contain at most ten operations. Platform input and concurrent-operation convergence remain outside this suite; Slate operation transformation is not a convergent OT. History is the only plugin exercised here.
