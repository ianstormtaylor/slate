
# `slate-simulator`

```js
import Simulator from 'slate-simulator'
```

A simulator to help writing tests for Slate editors and plugins.

- [Example](#example)
- [Methods](#methods)
  - [`beforeInput`](#beforeinput)
  - [`blur`](#blur)
  - [`copy`](#copy)
  - [`cut`](#cut)
  - [`drop`](#drop)
  - [`focus`](#focus)
  - [`keyDown`](#keydown)
  - [`paste`](#paste)
  - [`select`](#select)


## Example

```js
import Simulator from 'slate-simulator'

const state = ...
const plugins = [ ... ]
const simulator = new Simulator({ state, plugins })

simulator
  .focus()
  .beforeInput({ data: 'H' })
  .beforeInput({ data: 'e' })
  .beforeInput({ data: 'l' })
  .beforeInput({ data: 'l' })
  .beforeInput({ data: 'o' })
  .beforeInput({ data: '!' })
  .keyDown({}, { key: 'enter' })

const nextState = simulator.state
```


## Methods

### `beforeInput`
`beforeInput(event: Object, data: Object) => Simulator`

Simulator a `beforeinput` event with an `event` object and `data` object.

### `blur`
`blur(event: Object, data: Object) => Simulator`

Simulator a `blur` event with an `event` object and `data` object.

### `copy`
`copy(event: Object, data: Object) => Simulator`

Simulator a `copy` event with an `event` object and `data` object.

### `cut`
`cut(event: Object, data: Object) => Simulator`

Simulator a `cut` event with an `event` object and `data` object.

### `drop`
`drop(event: Object, data: Object) => Simulator`

Simulator a `drop` event with an `event` object and `data` object.

### `focus`
`focus(event: Object, data: Object) => Simulator`

Simulator a `focus` event with an `event` object and `data` object.

### `keyDown`
`keyDown(event: Object, data: Object) => Simulator`

Simulator a `keyDown` event with an `event` object and `data` object.

### `select`
`select(event: Object, data: Object) => Simulator`

Simulator a `select` event with an `event` object and `data` object.

