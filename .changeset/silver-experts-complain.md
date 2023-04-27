---
"slate": minor
"slate-react": minor
---

Breaking changes:
- Enhanced error handling by introducing **`undefined`** checks
- Added **`editor.onError`** function to handle errors in functions that depend on **`editor`**
- Introduced global **`ErrorLogger`** interface for error handling in functions not depending on **`editor`**
- No errors are thrown by default, addressing community feedback from issue #3641
- Updated return types of several functions to include **`| undefined`**
- Replaced **`throw new Error()`** statements with either **`editor.onError()`** or **`ErrorLogger.onError()`**
- Implemented conditional checks for variables before accessing them to prevent crashes and improve code stability
