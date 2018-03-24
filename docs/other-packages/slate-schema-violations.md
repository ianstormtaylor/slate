# slate-schema-violations

```javascript
import {
  CHILD_OBJECT_INVALID,
  CHILD_REQUIRED,
  CHILD_TYPE_INVALID,
  CHILD_UNKNOWN,
  FIRST_CHILD_OBJECT_INVALID,
  FIRST_CHILD_TYPE_INVALID,
  LAST_CHILD_OBJECT_INVALID,
  LAST_CHILD_TYPE_INVALID,
  NODE_DATA_INVALID,
  NODE_IS_VOID_INVALID,
  NODE_MARK_INVALID,
  NODE_TEXT_INVALID,
  PARENT_OBJECT_INVALID,
  PARENT_TYPE_INVALID,
} from 'slate-schema-violations'
```

A set of constants for the built-in violations in a Slate schema.

## Example

```javascript
import React from 'react'
import Types from 'slate-prop-types'

class Toolbar extends React.Component {

  propTypes = {
    block: Types.block,
    schema: Types.schema.isRequired,
    value: Types.value.isRequired,
  }

  ...

}
```

## Exports

### `CHILD_OBJECT_INVALID`

```javascript
{
  child: Node,
  index: Number,
  node: Node,
  rule: Object,
}
```

Raised when the `object` property of a child node is invalid.

### `CHILD_REQUIRED`

```javascript
{
  index: Number,
  node: Node,
  rule: Object,
}
```

Raised when a child node was required but none was found.

### `CHILD_TYPE_INVALID`

```javascript
{
  child: Node,
  index: Number,
  node: Node,
  rule: Object,
}
```

Raised when the `type` property of a child node is invalid.

### `CHILD_UNKNOWN`

```javascript
{
  child: Node,
  index: Number,
  node: Node,
  rule: Object,
}
```

Raised when a child was not expected but one was found.

### `FIRST_CHILD_OBJECT_INVALID`

```javascript
{
  child: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `object` property of the first child node is invalid, when a specific `first` rule was defined in a schema.

### `FIRST_CHILD_TYPE_INVALID`

```javascript
{
  child: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `type` property of the first child node is invalid, when a specific `first` rule was defined in a schema.

### `LAST_CHILD_OBJECT_INVALID`

```javascript
{
  child: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `object` property of the last child node is invalid, when a specific `last` rule was defined in a schema.

### `LAST_CHILD_TYPE_INVALID`

```javascript
{
  child: Node,
  node: Node,
  rule: Object,
}
```

Raised when the `type` property of the last child node is invalid, when a specific `last` rule was defined in a schema.

### `NODE_DATA_INVALID`

```javascript
{
  key: String,
  node: Node,
  rule: Object,
  value: Mixed,
}
```

Raised when the `data` property of a node contains an invalid entry.

### `NODE_IS_VOID_INVALID`

```javascript
{
  node: Node,
  rule: Object,
}
```

Raised when the `isVoid` property of a node is invalid.

### `NODE_MARK_INVALID`

```javascript
{
  mark: Mark,
  node: Node,
  rule: Object,
}
```

Raised when one of the marks in a node is invalid.

### `NODE_TEXT_INVALID`

```javascript
{
  text: String,
  node: Node,
  rule: Object,
}
```

Raised when the text content of a node is invalid.

### `PARENT_OBJECT_INVALID`

```javascript
{
  node: Node,
  parent: Node,
  rule: Object,
}
```

Raised when the `object` property of the parent of a node is invalid, when a specific `parent` rule was defined in a schema.

### `PARENT_TYPE_INVALID`

```javascript
{
  node: Node,
  parent: Node,
  rule: Object,
}
```

Raised when the `type` property of the parent of a node is invalid, when a specific `parent` rule was defined in a schema.

