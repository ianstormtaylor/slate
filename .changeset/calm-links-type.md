---
'slate': minor
'slate-react': minor
---

Add opt-in `inlineEdgeAffinity` and `leafEdgeAffinity` editor hooks and `Editor.insertionPoint` for consistent insertion at inline and mark boundaries. Implicit text, fragment and inline-node insertion at collapsed carets follows the configured rules, and `Editor.marks` reports the receiving leaf’s marks. Both hooks default to `null`, preserving existing behavior.

`BaseEditor` now requires the two affinity hooks and the `insertionPoint` query. Editors created through `createEditor` receive them automatically; structurally constructed editors and editor mocks must supply them. Slate React disables native insertion when affinity changes the receiving point, while retaining compatibility with older supported Slate peers that lack the helper.
