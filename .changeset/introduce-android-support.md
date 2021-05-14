---
'slate-react': minor
---

Added support for Android devices using a `MutationObserver` based reconciliation layer.

Bugs should be expected; translating mutations into a set of operations that need to be reconciled onto the Slate model is not an absolute science, and requires a lot of guesswork and handling of edge cases. There are still edge cases that aren't being handled.

This reconciliation layer aims to support Android 10 and 11. Earlier versions of Android work to a certain extent, but have more bugs and edge cases that currently aren't well supported.
