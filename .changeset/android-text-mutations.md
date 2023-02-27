---
'slate-react': patch
---

The `RestoreDOM` manager that is used Android no longer restores the DOM to its previous state for text mutations. This allows the editor state to be reconciled during a composition without interrupting the composition, as programatically updating the `textContent` of a text node ends the current composition.
