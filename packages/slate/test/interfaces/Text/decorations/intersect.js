import { Text } from 'slate'

export const input = [
  {
    anchor: {
      path: [0],
      offset: 1,
    },
    focus: {
      path: [0],
      offset: 5,
    },
    decoration1: 'decoration1',
  },
  {
    anchor: {
      path: [0],
      offset: 1,
    },
    focus: {
      path: [0],
      offset: 3,
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
      offset: 2,
    },
    decoration3: 'decoration3',
  },
  {
    anchor: {
      path: [0],
      offset: 2,
    },
    focus: {
      path: [0],
      offset: 4,
    },
    decoration4: 'decoration4',
  },
]

export const test = decorations => {
  return Text.decorations({ text: 'abcdef', mark: 'mark' }, decorations)
}

export const output = [
  {
    leaf: {
      text: 'a',
      mark: 'mark',
    },
    position: { start: 0, end: 1, isFirst: true },
  },
  {
    leaf: {
      text: 'b',
      mark: 'mark',
      decoration1: 'decoration1',
      decoration2: 'decoration2',
    },
    position: { start: 1, end: 2 },
  },
  {
    leaf: {
      text: '',
      mark: 'mark',
      decoration1: 'decoration1',
      decoration2: 'decoration2',
      decoration3: 'decoration3',
      decoration4: 'decoration4',
    },
    position: { start: 2, end: 2 },
  },
  {
    leaf: {
      text: 'c',
      mark: 'mark',
      decoration1: 'decoration1',
      decoration2: 'decoration2',
      decoration4: 'decoration4',
    },
    position: { start: 2, end: 3 },
  },
  {
    leaf: {
      text: 'd',
      mark: 'mark',
      decoration1: 'decoration1',
      decoration4: 'decoration4',
    },
    position: { start: 3, end: 4 },
  },
  {
    leaf: {
      text: 'e',
      mark: 'mark',
      decoration1: 'decoration1',
    },
    position: { start: 4, end: 5 },
  },
  {
    leaf: {
      text: 'f',
      mark: 'mark',
    },
    position: { start: 5, end: 6, isLast: true },
  },
]
