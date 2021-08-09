---
'slate-react': patch
---

Fix crash when unmounting an editor rendered within a React portal. The issue was arising at unmount time, because `getRootNode` returned the dettached portal node which is not an instance of `Document` or `ShadowRoot`. As a fix, `getDocumentOrShadowRoot` has been updated to return `undefined` instead of throwing.
