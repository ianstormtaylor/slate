---
'slate-react': patch
---

This change fixes syncing between a slate selection and the DOM selection in some cases when a lot of rerenders happen. Since the useEffect that's modified in this change was run on every rerender, it could sometimes be triggered when the slate selection didn't actually change which can have some unexpected side effects. This fixes that by using the newly added useSlateSelection to be able to add the selection as a dependency to this effect so it does not retrigger on every rerender of the component.

Besides that this change also introduces a new `useSlateSelection` convenience hook for getting the selection whenever it changes.
