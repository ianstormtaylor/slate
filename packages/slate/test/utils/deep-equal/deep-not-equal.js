import { isDeepEqual } from '../../../src/utils/deep-equal'

export const input = {
  objectA: {
    text: 'same text',
    bold: true,
    italic: { origin: 'inherited', value: false },
  },
  objectB: {
    text: 'same text',
    bold: true,
    italic: { origin: 'inherited', value: true },
  },
}

export const test = ({ objectA, objectB }) => {
  return isDeepEqual(objectA, objectB)
}

export const output = false
