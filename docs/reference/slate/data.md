# `Data`

```js
import { Data } from 'slate'
```

Data is simply a thin wrapper around [`Immutable.Map`](https://facebook.github.io/immutable-js/docs/#/Map), so that you don't need to ever depend on Immutable directly, and for future compatibility.

A data object can have any properties associated with it.

## Static Methods

### `Data.create`

`Data.create(properties: Object) => Data`

Create a data object from a plain JavaScript object of `properties`.

### `Data.fromJSON`

`Data.fromJSON(object: Object) => Data`

Create a data object from a JSON `object`.
