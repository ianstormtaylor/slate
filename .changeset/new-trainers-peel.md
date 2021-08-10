---
'slate-react': patch
---

Fix crash when unmounting an editor rendered within a React portal. The issue was arising at unmount time, because `getRootNode` returned the dettached portal node and it is not an instance of `Document` or `ShadowRoot`. As a fix, `getDocumentOrShadowRoot` has been refactored to return a root node instead of throwing. In sum, this patch fixes a regression bug caused by https://github.com/ianstormtaylor/slate/pull/3749/
