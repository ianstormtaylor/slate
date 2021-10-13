---
'slate-hyperscript': patch
---

createEditor is now exported from slate-hyperscript, making it easier to set up custom editor tests

For example:

```
const jsx = createHyperscript({
  creators: {
    editor: createEditor(aFunctionThatReturnsAnEditorObject)
  },
  elements: {
    block: { type: 'block' },
    inline: { type: 'inline' }
  }
})
```
