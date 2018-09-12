# `slate-simulator`

```js
import Simulator from '@gitbook/slate-simulator'
```

A simulator to help writing tests for Slate editors and plugins. By default the simulator does not include the [core plugins](https://docs.slatejs.org/guides/plugins#core-plugins) as they have a lot of dependencies on browser-specific globals, so running them in CI environments is very hard. If you need the core plugins for your use case you need to import them manually.

## Example

```js
import Simulator from '@gitbook/slate-simulator'

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

## Example with core plugins

```js
import Simulator from '@gitbook/slate-simulator'
import { BeforePlugin, AfterPlugin } from '@gitbook/slate-react'

const value = ...
const plugins = [ BeforePlugin(), ... , AfterPlugin() ]
const simulator = new Simulator({ value, plugins })
```

Core plugins will trigger default behaviour for the events. Without them, only the changes defined in the plugins passed to slate-simulator will be applied. For example, `beforeInput()` event will not insert the data's text if none of the plugins being tested does it.

## Example for `DataTransfer` events

In order to simulate paste and drop events you will need to create a [DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer). However this object is browser dependant and is not easy to manipulate in CI environments. The easiest work around is to fake its API with a mockup class:

```js
class FakeDataTransfer {
  constructor(props) {
    this.items = []
    this.types = []
  }

  getData(key) {
    return this.items.find(item => item.key === key).value
  }

  setData(key, value) {
    this.types.push(key)
    this.items.push({ key, value })
  }
}
```

Later, you can use it this way to fake a paste event:

```js
import { setEventTransfer } from '@gitbook/slate-react'

const pastedText = 'slatejs.org'

const fakeDataTransfer = new FakeDataTransfer()
fakeDataTransfer.setData('text', "this text doesn't matter")

const pasteEvent = { dataTransfer: fakeDataTransfer }
setEventTransfer(pasteEvent, 'text', pastedText)

simulator.paste(pasteEvent)
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

### `keyUp`

`keyUp(event: Object) => Simulator`

Simulator a `keyUp` event with an `event` object.

### `paste`

`paste(event: Object) => Simulator`

Simulator a `paste` event with an `event` object.

### `select`

`select(event: Object) => Simulator`

Simulator a `select` event with an `event` object.
