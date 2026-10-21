---
'slate-react': patch
---

Chrome's Writing Direction menu command no longer breaks the editor. The command changes the DOM without a `beforeinput` event, wrapping text in a `direction` span, so React later threw `NotFoundError` on `removeChild` and the editor unmounted. Slate now undoes the DOM changes of any `format*` input it was not asked to handle first and keeps the selection.
