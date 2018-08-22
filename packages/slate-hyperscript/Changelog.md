# Changelog

This document maintains a list of changes to the `slate-hyperscript` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.

---

### `0.9.0` — August 22, 2018

###### NEW

**Introducing the `schema` option.** You can now pass in a `schema` option to the `createHyperscript` factory, which will ensure that schema rules are bound whenever you use the `<value>` tag. This is helpful for defining atomicity of decorations, or the voidness of nodes in the future.

###### BREAKING

**The `isFocused` prop of `<selection>` is now `focused`.** This is just to match the other boolean properties in this library which all omit the `is*` prefix to stay consistent with the DOM-style.

**The `atomic` prop of decorations is now controlled by the schema.** Previously each individual decoration could control whether it was atomic or not, but now this is controlled in the schema definition for the mark itself.

---

### `0.8.0` — August 15, 2018

###### BREAKING

**The `decorators` option was renamed to `decorations`.** This was previously incorrectly named, and renaming it is just an attempt to keep the API consistent with how Slate describes the concept everywhere else.

---

### `0.7.0` — August 3, 2018

###### NEW

**Updated to work with `slate@0.37.0` with points.** This isn't a breaking change to any of the API's in `slate-hyperscript` itself, but it does update it to no longer depend on the core API's that were deprecated in `0.37.0`.

###### DEPRECATED

**The `<selection>` tag now takes `<anchor />` and `<focus />` children.** Previously you would set properties like `anchorKey=` or `focusOffset=` directly on the `<selection>` itself, but now these are handled as two children point tags:

```jsx
const selection = (
  <selection>
    <anchor key="a" offset={1} />
    <focus key="a" offset={3} />
  </selection>
)
```

---

### `0.6.0` — July 27, 2018

###### NEW

**Updated to work with the `slate@0.35.0` with paths.** The original logic for selections and decorations didn't account for paths properly. This isn't a breaking change, but to use this library with the latest Slate you'll need to upgrade.

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

**Updated to work with `slate@0.29.0`.** This is required because `slate-hyperscript` needs access to the new `Value` model.

###### DEPRECATED

**The `<state>` tag has been renamed to `<value>`.** This is to stay in line with the newest version of Slate where the `State` object was renamed to `Value`.

---

### `0.2.0` — October 14, 2017

###### BREAKING

**Updated work with `slate@0.27.0`.** The new version of Slate renames the old `Range` model to `Leaf`, and the old `Selection` model to `Range`.

---

### `0.1.0` — September 17, 2017

:tada:
