---
'slate-react': minor
---

Ignore input, paste and drop events dispatched by script rather than by the user, so a script running on the page can no longer insert content without the user acting.

This breaks tests that simulate a paste by dispatching an event, such as `fireEvent.paste` or Cypress's `trigger('paste')`. Drive a real paste instead, with Playwright's keyboard or `cypress-real-events`, or call `editor.insertData` directly.
