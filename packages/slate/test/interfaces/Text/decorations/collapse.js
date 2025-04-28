import { Text } from 'slate'

export const input = [
  {
    anchor: {
      path: [0],
      offset: 1,
    },
    focus: {
      path: [0],
      offset: 2,
    },
    decoration1: 'decoration1',
  },
  {
    anchor: {
      path: [0],
      offset: 2,
    },
    focus: {
      path: [0],
      offset: 2,
    },
    decoration2: 'decoration2',
  },
  {
    anchor: {
      path: [0],
      offset: 2,
    },
    focus: {
      path: [0],
      offset: 3,
    },
    decoration3: 'decoration3',
  },
  {
    anchor: {
      path: [0],
      offset: 4,
    },
    focus: {
      path: [0],
      offset: 4,
    },
    decoration4: 'decoration4',
  },
]

export const test = decorations => {
  return Text.decorations({ text: 'abcd', mark: 'mark' }, decorations)
}

export const output = [
  {
    text: 'a',
    mark: 'mark',
    start: 0,
    end: 1,
  },
  {
    text: 'b',
    mark: 'mark',
    decoration1: 'decoration1',
    start: 1,
    end: 2,
  },
  {
    text: '',
    mark: 'mark',
    decoration1: 'decoration1',
    decoration2: 'decoration2',
    decoration3: 'decoration3',
    start: 2,
    end: 2,
  },
  {
    text: 'c',
    mark: 'mark',
    decoration3: 'decoration3',
    start: 2,
    end: 3,
  },
  {
    text: 'd',
    mark: 'mark',
    start: 3,
    end: 4,
  },
  {
    text: '',
    mark: 'mark',
    decoration4: 'decoration4',
    start: 4,
    end: 4,
  },
]
