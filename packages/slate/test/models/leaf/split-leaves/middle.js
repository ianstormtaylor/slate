/** @jsx h */

import { List } from 'immutable'
import { Leaf } from 'slate'

export const input = List([
  Leaf.create({
    text: 'Cat',
  }),
  Leaf.create({
    text: 'is',
  }),
  Leaf.create({
    text: 'Cute',
  }),
])

export default function(leaves) {
  return List(Leaf.splitLeaves(leaves, 4))
}

export const output = List([
  List([
    Leaf.create({
      text: 'Cat',
    }),
    Leaf.create({
      text: 'i',
    }),
  ]),
  List([
    Leaf.create({
      text: 's',
    }),
    Leaf.create({
      text: 'Cute',
    }),
  ]),
])
