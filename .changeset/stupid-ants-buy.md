---
'slate': minor
---

- When removing a text node containing the cursor, always perfer placing the cursor in a sibling text node if one exists.
  - Previously, the selection would enter a sibling inline in some circumstances, even when a sibling text node was available.
  - The most noticeable effect of this change occurs when pressing backspace at the start of line N when the last non-empty node in line N-1 is an inline.
    - Before, the cursor would be placed inside the inline.
    - Now, the cursor is placed outside the inline.
