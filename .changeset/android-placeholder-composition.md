---
'slate-react': patch
---

Fix an Android crash ("Failed to execute 'removeChild' on 'Node'") when typing starts in an empty editor just as the placeholder appears. The DOM restore that runs before Android renders no longer undoes React's own placeholder changes.
