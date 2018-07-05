/** @jsx h */

import { List } from 'immutable'
import { Leaf } from '../../../..'

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
  return List(Leaf.splitLeaves(leaves, 'CatisCute'.length))
}

export const output = List([
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
  List([
    Leaf.create({
      text: '',
    }),
  ]),
])
