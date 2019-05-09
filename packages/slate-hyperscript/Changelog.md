# Changelog

This document maintains a list of changes to the `slate-hyperscript` package with each new version. Until `1.0.0` is released, breaking changes will be added as minor version bumps, and smaller changes won't be accounted for since the library is moving quickly.

---

### `0.13.0` — May 8, 2019

###### BREAKING

**Updated to work with `slate@0.47`.** The hyperscript creators have been updated to work with the `Annotation` model introduced in the latest version of Slate.

**The `slate-hyperscript` package now uses the "annotations" name.** All of the existing APIs that previously used the word "decorations" in `slate-hyperscript` have been updated.

---

### `0.12.0` — May 1, 2019

###### BREAKING

**Updated to work with `slate@0.46`.** The hyperscript creators have been updated to work alongside the new text data model in the latest version of slate.

**The `<text>` and `<mark>` hyperscript tags must now return a single text node.** Previously they were more lenient, and might return an array of text nodes. This made it hard to be explicit in tests, and made certain configurations impossible. This new restriction makes it easier to reason about what the tags return, even if it makes certain cases slightly more verbose. For example:

```jsx
<paragraph>
  <b>
    a few <i>italic</i> and bold words.
  </b>
</paragraph>
```

Must now be written as:

```jsx
<paragraph>
  <b>a few </b>
  <b>
    <i>italic</i>
  </b>
  <b> and bold words.</b>
</paragraph>
```

Slightly more verbose, but with the benefit of being easy to tell exactly how many text nodes you will receive in your resulting document. And it allows setting `key=` values on the mark tags directly, since they map `1:1` to text nodes.

---

### `0.11.0` — October 9, 2018

###### BREAKING

**Updated to the latest version of `slate`.** The `slate-hyperscript` codebase has been updated to be compatible with the latest version of `slate`, `0.42.0`. This is a backward incompatible upgrade, and so the peer dependency range has been bumped.

**`slate-hyperscript` no longer normalizes values.** This behavior was very problematic because it meant that you could not determine exactly what output you'd receive from any given hyperscript creation. The logic for creating child nodes was inconsistent, relying on the built-in normalization to help keep it "normal". While this is sometimes helpful, it makes writing tests for invalid states very tricky, if not impossible.

Now, `slate-hyperscript` does not do any normalization, meaning that you can create any document structure with it. For example, you can create a block node inside an inline node, even though a Slate editor wouldn't allow it. Or, if you don't create leaf text nodes, they won't exist in the output.

For example these are no longer equivalent:

```jsx
<document>
  <paragraph>
    <link>word</link>
  </paragraph>
</document>
```

```jsx
<document>
  <paragraph>
    <text />
    <link>word</link>
    <text />
  </paragraph>
</document>
```

Similarly, these are no longer equivalent either:

```jsx
<document>
  <paragraph />
</document>
```

```jsx
<document>
  <paragraph>
    <text />
  </paragraph>
</document>
```

This allows you to much more easily test invalid states and transition states. However, it means that you need to be more explicit in the "normal" states than previously.

**The `<text>` and `<mark>` creators now return useful objects.** This is a related change that makes the library more useful. Previously you could expect to receive a `value` from the `<value>` creator, but the others were less consistent. For example, the `<text>` creator would actually return an array, instead of the `Text` node that you expect.

```js
// Previously you had to do...
const text = <text>word</text>[0]

// But now it's more obvious...
const text = <text>word</text>
```

Similarly, the `mark` creator used to return a `Text` node. Now it returns a list of `Leaf` objects, which can be passed directly as children to the `<text>` creator.

---

### `0.10.0` — August 22, 2018

###### BREAKING

**Remove all previously deprecated code paths.** This helps to reduce some of the complexity in Slate by not having to handle these code paths anymore. And it helps to reduce file size. When upgrading, it's _highly_ recommended that you upgrade to the previous version first and ensure there are no deprecation warnings being logged, then upgrade to this version.

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
