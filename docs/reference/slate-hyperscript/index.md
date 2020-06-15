# `slate-hyperscript`

```js
import h from 'slate-hyperscript'
import { createHyperscript } from 'slate-hyperscript'
```

A hyperscript helper for writing Slate documents with JSX!

## Example

```js
/** @jsx h */

import h from 'slate-hyperscript'

const value = (
  <value>
    <document>
      <block type="paragraph">
        A string of <mark type="bold">bold</mark> in a{' '}
        <inline type="link" data={{ src: 'http://slatejs.org' }}>
          Slate
        </inline>{' '}
        editor!
      </block>
      <block type="image" data={{ src: 'https://...' }} />
    </document>
  </value>
)
```

```js
/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'

const h = createHyperscript({
  blocks: {
    paragraph: 'paragraph',
    image: 'image',
  },
  inlines: {
    link: 'link',
  },
  marks: {
    b: 'bold',
  },
})

const value = (
  <value>
    <document>
      <paragraph>
        A string of <b>bold</b> in a <link src="http://slatejs.org">Slate</link>{' '}
        editor!
      </paragraph>
      <image src="https://..." />
    </document>
  </value>
)
```

## Exports

### `h`

`Function`

The default export of `slate-hyperscript` is a barebones hyperscript helper that you can immediately start using to create Slate objects.

### `createHyperscript`

`createHyperscript(options: Object) => Function`

The other export is a `createHyperscript` helper that you can use to create your own, smarter, schema-aware hyperscript helper. You can pass it `options` that tell it about your schema to make creating objects much terser.

```js
{
  blocks: Object,
  inlines: Object,
  marks: Object,
  decorations: Object,
  creators: Object,
}
```
