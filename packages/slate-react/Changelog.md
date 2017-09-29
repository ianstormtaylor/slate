
# Changelog

This document maintains a list of changes to the `slate-react` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.


---


### `0.2.0` — September 29, 2017

- **`onBeforeChange` is now called automatically again in `<Editor>`.** This was removed before, in attempt to decrease the "magic" that the editor was performing, since it normalizes when new props are passed to it, creating instant changes. But we discovered that it is actually necessary for now, so it has been added again.


---


### `0.1.0` — September 17, 2017

:tada:

