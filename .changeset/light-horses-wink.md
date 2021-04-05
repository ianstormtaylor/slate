---
slate: minor
---

**Remove `Element.isElementProps` and `Text.isTextProps`.** These didn't actually do what they promised to do, since they were really check if something was a base `Element` or base `Text` node, and not just a valid props object. So this removes them to not cause confusion. If you need to check if something is a valid props object you will need to implement it in userland because Slate doesn't have awareness of what is valid for you.
