/** @jsx h */
/* eslint-disable import/no-extraneous-dependencies */
import { Set } from 'immutable'
import { Mark } from 'slate'
import h from '../../../../helpers/h'

export const input = <b />[0]

export default function(t) {
  return t.getMarks()
}

export const output = Set.of(Mark.create('bold'))
