---
'slate-react': minor
---

Add a controlled `value` prop to `Slate`. Pass the value from `onValueChange` back in, and Slate recognizes that exact object and doesn't apply it again. Any other value is applied as a change from outside the editor through `editor.setChildren`, in a layout effect, so the selection and history stay valid. Values passed in aren't reported through `onValueChange`. Updates wait while the user is composing text or Android has pending input, and only the latest is applied. `value` and `initialValue` together throw.
