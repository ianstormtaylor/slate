# Changelog

This document maintains a list of changes to the `slate-prop-types` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.

---

### `0.4.0` — October 27, 2017

###### BREAKING

**Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

---

### `0.3.0` — October 27, 2017

###### BREAKING

**Updated to work with `slate@0.29.0`.** This is required because `slate-prop-types` needs access to the new `Value` model.

###### DEPRECATED

**The `state` prop type has been renamed to `value`.** This is to stay in line with `slate-react@0.29.0` where the `State` object was renamed.

---

### `0.2.0` — October 14, 2017

###### BREAKING

**Updated work with `slate@0.27.0`.** The new version of Slate renames the old `Range` model to `Leaf`, and the old `Selection` model to `Range`.

---

### `0.1.0` — September 17, 2017

:tada:
