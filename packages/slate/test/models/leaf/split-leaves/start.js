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
  return List(Leaf.splitLeaves(leaves, 0))
}

export const output = List([
  List([Leaf.create()]),
  List([
    Leaf.create({
      text: 'Cat',
    }),
    Leaf.create({
      text: 'is',
    }),
    Leaf.create({
      text: 'Cute',
    }),
  ]),
])
