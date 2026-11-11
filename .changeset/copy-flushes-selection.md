---
'slate-react': patch
---

Copy and cut now use the selection the user just made. Selection changes reach `editor.selection` a little later than they happen, and copy and cut wrote the clipboard from `editor.selection`, so a copy straight after selecting, such as Ctrl+A followed at once by Ctrl+C, could copy the previous selection or nothing at all. Copy and cut now process any pending selection change first, before an `onCopy` or `onCut` handler runs.
