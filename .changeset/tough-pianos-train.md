---
'slate': patch
---

Optimize `isElement`, `isText`, `isNodeList` and `isEditor` by removing dependency on `is-plain-object` and by performing shallow checks by default. To perform a full check, including all descendants, pass the `{ deep: true }` option to `isElement`, `isNodeList` or `isEditor`.
