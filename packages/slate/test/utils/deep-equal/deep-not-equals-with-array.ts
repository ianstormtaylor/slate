import { isDeepEqual } from '../../../src/utils/deep-equal'

export const input = {
  objectA: {
    text: 'same text',
    array: ['array-content'],
    bold: true,
  },
  objectB: {
    text: 'same text',
    array: ['array-content'],
    bold: false,
  },
}

export const test = ({ objectA, objectB }) => {
  return isDeepEqual(objectA, objectB)
}

export const output = false
