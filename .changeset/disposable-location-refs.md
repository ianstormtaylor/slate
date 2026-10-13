---
'slate': minor
---

Support Symbol.dispose on path, point and range refs so using declarations can release tracked locations automatically. TypeScript consumers now need TypeScript 5.2 or later with `esnext.disposable` in `lib`, or `skipLibCheck`.
