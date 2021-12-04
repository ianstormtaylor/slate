---
'slate': patch
---

Allow `Operation` type to be extended

For example:

```
import type { BaseOperation } from 'slate'

type CustomOperation =
 | BaseOperation
 | YourCustomOperation
 | AnotherCustomOperation

declare module 'slate' {
  interface CustomTypes {
    Operation: CustomOperation;
  }
}
```
