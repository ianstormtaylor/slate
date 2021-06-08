---
'slate-react': patch
---

Fix backward typing bug in Safari by ensuring the selection is always removed on blur.
Safari doesn't always remove the selection, even if the contenteditable element no longer has focus.
In this scenario, we need to forcefully remove the selection on blur.
Refer to https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
