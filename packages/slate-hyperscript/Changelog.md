
# Changelog

This document maintains a list of changes to the `slate-hyperscript` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.


---


### `0.3.0` — October 27, 2017

###### BREAKING

- **Updated to work with `slate@0.29.0`.** This is required because `slate-hyperscript` needs access to the new `Value` model.

###### DEPRECATED

- **The `<state>` tag has been renamed to `<value>`.** This is to stay in line with the newest version of Slate where the `State` object was renamed to `Value`.


---


### `0.2.0` — October 14, 2017

###### BREAKING

- **Updated work with `slate@0.27.0`.** The new version of Slate renames the old `Range` model to `Leaf`, and the old `Selection` model to `Range`.


---


### `0.1.0` — September 17, 2017

:tada:

