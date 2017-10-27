
# `slate-simulator`

```js
import Simulator from 'slate-simulator'
```

A simulator to help writing tests for Slate editors and plugins.


## Example

```js
import Simulator from 'slate-simulator'

const value = ...
const plugins = [ ... ]
const simulator = new Simulator({ value, plugins })

simulator
  .focus()
  .beforeInput({ data: 'H' })
  .beforeInput({ data: 'e' })
  .beforeInput({ data: 'l' })
  .beforeInput({ data: 'l' })
  .beforeInput({ data: 'o' })
  .beforeInput({ data: '!' })
  .keyDown({ key: 'Enter' })

const newValue = simulator.value
```


## Methods

### `beforeInput`
`beforeInput(event: Object) => Simulator`

Simulator a `beforeinput` event with an `event` object.

### `blur`
`blur(event: Object) => Simulator`

Simulator a `blur` event with an `event` object.

### `copy`
`copy(event: Object) => Simulator`

Simulator a `copy` event with an `event` object.

### `cut`
`cut(event: Object) => Simulator`

Simulator a `cut` event with an `event` object.

### `drop`
`drop(event: Object) => Simulator`

Simulator a `drop` event with an `event` object.

### `focus`
`focus(event: Object) => Simulator`

Simulator a `focus` event with an `event` object.

### `keyDown`
`keyDown(event: Object) => Simulator`

Simulator a `keyDown` event with an `event` object.

### `select`
`select(event: Object) => Simulator`

Simulator a `select` event with an `event` object.

