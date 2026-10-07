---
'slate-react': patch
---

Initialize the editor from `initialValue` when a different `editor` is passed to an already mounted `<Slate>`, such as when React fast refresh re-runs the `useMemo` that creates it. Previously the new editor kept empty `children`, and the next operation threw "Cannot find a descendant at path [0]".
