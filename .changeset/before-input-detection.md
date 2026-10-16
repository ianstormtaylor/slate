---
'slate-dom': patch
---

Fix `HAS_BEFORE_INPUT_SUPPORT` so legacy Chrome (75 and older) uses the `beforeinput` fallback as intended. The check combined the desktop and Android legacy flags with `||`, which was true for almost every browser.
