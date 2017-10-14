
# Changelog

This document maintains a list of changes to the `slate-react` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.


---


### `0.4.0` — October 14, 2017

###### BREAKING

- **Updated work with `slate@0.27.0`.** The new version of Slate renames the old `Range` model to `Leaf`, and the old `Selection` model to `Range`.

###### NEW

- **Added a new `findDOMRange` helper.** Give a Slate `Range` object, it will return a DOM `Range` object with the correct start and end points, making it easier to work with lower-level DOM selections.

- **Added a new `findRange` helper.** Given either a DOM `Selection` or DOM `Range` object and a Slate `State`, it will return a Slate `Range` representing the same part of the document, making it easier to work with DOM selection changes.

- **Added a new `findNode` helper.** Given a DOM `Element`, it will find the closest Slate `Node` that it represents, making 


---


### `0.3.0` — October 13, 2017

###### BREAKING

- **The decoration logic has been updated to use `slate@0.26.0`.** This allows for more complex decoration logic, and even decorations based on external information.


---


### `0.2.0` — September 29, 2017

###### BREAKING

- **`onBeforeChange` is now called automatically again in `<Editor>`.** This was removed before, in attempt to decrease the "magic" that the editor was performing, since it normalizes when new props are passed to it, creating instant changes. But we discovered that it is actually necessary for now, so it has been added again.


---


### `0.1.0` — September 17, 2017

:tada:

