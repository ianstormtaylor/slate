
This document maintains a list of changes to Slate with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and non-breaking changes won't be accounted for since the library is moving quickly.


## `0.5.0`
_July 20, 2016_

#### BREAKING CHANGES

- **Change `node.getTextNodes()` to `node.getTexts()`.** This is just for consistency with the other existing `Node` methods like `getBlocks()`, `getInlines()`, etc. And it's nicely shorter. :wink:

- **Change `Node` methods to `throw` on unexpected states.** This shouldn't break anything for most folks, unless a strange edge-case was going undetected previously.


## `0.4.0`
_July 20, 2016_

#### BREAKING CHANGES

- **Change `renderMark(mark, state, editor)` to `renderMark(mark, marks, state, editor)`.** This change allows you to render marks based on multiple `marks` presence at once on a given range of text, for example using a custom `BoldItalic.otf` font when text has both `bold` and `italic` marks.


## `0.3.0`
_July 20, 2016_

#### BREAKING CHANGES

- **Changed `unwrapBlock` to unwrap selectively.** Previously, calling `unwrapBlock` with a range representing a middle sibling would unwrap _all_ of the siblings, removing the wrapping block entirely. Now, calling it with those same arguments will only move the middle sibling up a layer in the hierarchy, preserving the nesting on any of its siblings. This changes makes it much simpler to implement functionality like unwrapping a single list item, which previously would unwrap the entire list.


## `0.2.0`
_July 18, 2016_

#### BREAKING CHANGES

- **Renamed `transform.mark()` to `transform.addMark()` and `transform.unmark()` to `transform.removeMark()`.** The new names make it clearer that the transforms are actions being performed, and it paves the way for adding a `toggleMark` convenience as well.


## `0.1.0`
_July 13, 2016_

:tada:

