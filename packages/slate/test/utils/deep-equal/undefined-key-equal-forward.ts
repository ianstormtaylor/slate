import { isDeepEqual } from '../../../src/utils/deep-equal'

export const input = {
  objectA: {
    text: 'same text',
    bold: undefined,
  },
  objectB: {
    text: 'same text',
  },
}

export const test = ({ objectA, objectB }) => {
  return isDeepEqual(objectA, objectB)
}

export const output = true
