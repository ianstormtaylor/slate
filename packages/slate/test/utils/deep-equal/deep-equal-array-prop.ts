import { isDeepEqual } from '../../../src/utils/deep-equal'

export const input = {
  objectA: {
    text: 'same text',
    tags: ['monkey', 'chimp', 'orangutan'],
    underline: { origin: 'inherited', value: false }, // "value" differs below
  },
  objectB: {
    text: 'same text',
    tags: ['monkey', 'chimp', 'orangutan'],
    italic: { origin: 'inherited', value: true },
    underline: { origin: 'inherited', value: true },
  },
}

export const test = ({ objectA, objectB }) => {
  return isDeepEqual(objectA, objectB)
}

export const output = false
