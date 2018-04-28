/** @jsx h */

import { NODE_DATA_INVALID } from 'slate-schema-violations'
import h from '../../helpers/h'

// Ensures quotes have a "bar" data attribute set to "bar"
const pluginBar = {
  schema: {
    blocks: {
      quote: {
        data: {
          bar: value => value === 'bar',
        },
        normalize: (change, reason, { node }) => {
          if (reason == NODE_DATA_INVALID) {
            change.setNodeByKey(node.key, {
              data: node.data.set('bar', 'bar'),
            })
          }
        },
      },
    },
  },
}

// Ensures quotes have a "foo" data attribute set to "foo"
const pluginFoo = {
  schema: {
    blocks: {
      quote: {
        data: {
          foo: value => value === 'foo',
        },
        normalize: (change, reason, { node }) => {
          if (reason == NODE_DATA_INVALID) {
            change.setNodeByKey(node.key, {
              data: node.data.set('foo', 'foo'),
            })
          }
        },
      },
    },
  },
}

export const schema = {
  plugins: [pluginBar, pluginFoo],
}

export const input = (
  <value>
    <document>
      <quote />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote bar="bar" foo="foo" />
    </document>
  </value>
)
