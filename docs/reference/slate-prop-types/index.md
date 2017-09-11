
# `slate-prop-types`

```js
import Types from 'slate-prop-types'
```

A set of React prop types for Slate editors and plugins.

- [Example](#example)
- [Exports](#exports)
  - [`block`](#block)
  - [`blocks`](#blocks)
  - [`change`](#change)
  - [`character`](#character)
  - [`characters`](#characters)
  - [`data`](#data)
  - [`document`](#document)
  - [`history`](#history)
  - [`inline`](#inline)
  - [`inlines`](#inlines)
  - [`mark`](#mark)
  - [`marks`](#marks)
  - [`node`](#node)
  - [`nodes`](#nodes)
  - [`range`](#range)
  - [`ranges`](#ranges)
  - [`schema`](#schema)
  - [`selection`](#selection)
  - [`stack`](#stack)
  - [`state`](#state)
  - [`text`](#text)
  - [`texts`](#texts)


## Example

```js
import React from 'react'
import Types from 'slate-prop-types'

class Toolbar extends React.Component {

  propTypes = {
    block: Types.block,
    schema: Types.schema.isRequired,
    state: Types.state.isRequired,
  }

  ...

}
```


## Exports

### `block`

Ensure that a value is a Slate `Block`.

### `blocks`

Ensure that a value is an immutable `List` of Slate [`Block`](../slate/block.md) objects.

### `change`

Ensure that a value is a Slate `Change`.

### `character`

Ensure that a value is a Slate `Character`.

### `characters`

Ensure that a value is an immutable `List` of Slate `Character` objects.

### `data`

Ensure that a value is a Slate `Data`.

### `document`

Ensure that a value is a Slate `Document`.

### `history`

Ensure that a value is a Slate `History`.

### `inline`

Ensure that a value is a Slate `Inline`.

### `inlines`

Ensure that a value is an immutable `List` of Slate [`Inline`](../slate/inline.md) objects.

### `mark`

Ensure that a value is a Slate `Mark`.

### `marks`

Ensure that a value is an immutable `Set` of Slate `Mark` objects.

### `node`

Ensure that a value is a Slate `Node`.

### `nodes`

Ensure that a value is an immutable `List` of Slate `Node` objects.

### `range`

Ensure that a value is a Slate `Range`.

### `ranges`

Ensure that a value is an immutable `List` of Slate `Range` objects.

### `schema`

Ensure that a value is a Slate `Schema`.

### `selection`

Ensure that a value is a Slate `Selection`.

### `stack`

Ensure that a value is a Slate `Stack`.

### `state`

Ensure that a value is a Slate `State`.

### `text`

Ensure that a value is a Slate `Text`.

### `texts`

Ensure that a value is a Slate `Texts`.
