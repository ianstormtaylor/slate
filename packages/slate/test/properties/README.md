# Core property tests

`yarn test` includes this suite with seed `20261014` and 100 runs per property. `yarn test:fuzz` runs the same 14 properties 5,000 times each, with a longer Mocha timeout. fast-check shrinks failures and prints the seed, replay path and counterexample.

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

## Scope

The fixed seed is a reproducible regression sample, not exhaustive coverage. Documents and sequences are deliberately small; sequences contain at most ten operations. Void-skipping positions, user-defined normalization, platform input and plugin behavior remain covered by their existing dedicated tests.
