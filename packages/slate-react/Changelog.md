
# Changelog

This document maintains a list of changes to the `slate-react` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.


---


### `0.5.0` — October 15, 2017

###### DEPRECATED

- **The `data` objects in event handlers have been deprecated.** There were a few different issues with these "helpers": `data.key` didn't account for international keyboards, many properties awkwardly duplicated information that was available on `event.*`, but not completely, and many properties were confusing as to when they applied. If you were using these, you'll now need to use the native `event.*` properties instead. There's also a helpful [`is-hotkey`](https://github.com/ianstormtaylor/is-hotkey) package for more complex hotkey matching.

###### NEW

- **Added a new `getEventRange` helper.** This gets the affected `Range` of Slate document given a DOM `event`. This is useful in the `onDrop` or `onPaste` handlers to retrieve the range in the document where the drop or paste will occur.

- **Added a new `getEventTransfer` helper.** This gets any Slate-related data from an `event`. It is modelled after the DOM's [`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) API, and is useful for retrieve the data being dropped or pasted in `onDrop` or `onPaste` events.


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

