# Changelog

This document maintains a list of changes to the `slate-plain-serializer` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.

---

### `0.7.0` — May 1, 2019

###### BREAKING

**Updated to work with `slate@0.46`.** The plain serializer has been updated to work alongside the new text data model in the latest version of slate. For serializing it requires you pass in the new format for text nodes. And for deserializing it will return the new format.

---

### `0.6.0` — August 22, 2018

###### BREAKING

**Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

---

### `0.5.0` — January 4, 2018

###### BREAKING

**The `kind` property of Slate objects has been renamed to `object`.** This is to reduce the confusion over the difference between "kind" and "type" which are practically synonyms. The "object" name was chosen to match the Stripe API, since it seems like a sensible choice and reads much more nicely when looking through JSON.

---

### `0.4.0` — October 27, 2017

###### BREAKING

**Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

---

### `0.3.0` — October 27, 2017

###### BREAKING

**Updated to work with `slate@0.29.0`.** This is required because `slate-plain-serializer` needs access to the new `Value` model.

---

### `0.2.0` — October 14, 2017

###### BREAKING

**Updated work with `slate@0.27.0`.** The new version of Slate renames the old `Range` model to `Leaf`, and the old `Selection` model to `Range`.

---

### `0.1.0` — September 17, 2017

:tada:
