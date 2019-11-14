import { produce } from 'immer'

import { Operation, Value } from '..'
import {
  DIRTY_PATHS,
  NORMALIZING,
  FLUSHING,
  PATH_REFS,
  POINT_REFS,
  RANGE_REFS,
} from '../utils/state'

import AnnotationCommands from './commands/annotation'
import TextCommands from './commands/text'
import NodeCommands from './commands/node'
import MarkCommands from './commands/mark'
import SelectionCommands from './commands/selection'
import GeneralCommands from './commands/general'
import ElementQueries from './queries/element'
import GeneralQueries from './queries/general'
import LocationQueries from './queries/location'
import NodeQueries from './queries/node'
import RangeQueries from './queries/range'

/**
 * The `Editor` class stores all the state of a Slate editor. It is extended by
 * plugins that wish to add their own methods that implement new behaviors.
 */

export class Editor {
  onChange: (value: Value, operations: Operation[]) => void
  operations: Operation[]
  value: Value

  constructor(
    props: {
      onChange?(value: Value, operations: Operation[]): void
      readOnly?: boolean
      value?: Value
    } = {}
  ) {
    const {
      onChange = () => {},
      value = produce(
        { children: [], selection: null, annotations: {} },
        () => {}
      ),
    } = props

    this.onChange = onChange
    this.operations = []
    this.value = value

    DIRTY_PATHS.set(this, [])
    FLUSHING.set(this, false)
    NORMALIZING.set(this, true)
    PATH_REFS.set(this, new Set())
    POINT_REFS.set(this, new Set())
    RANGE_REFS.set(this, new Set())
  }
}

export interface Editor
  extends AnnotationCommands,
    TextCommands,
    NodeCommands,
    MarkCommands,
    SelectionCommands,
    GeneralCommands,
    ElementQueries,
    GeneralQueries,
    LocationQueries,
    NodeQueries,
    RangeQueries {}

const mixin = (Mixins: Array<new () => any>) => {
  for (const Mixin of Mixins) {
    for (const key of Object.getOwnPropertyNames(Mixin.prototype)) {
      if (key !== 'constructor') {
        Editor.prototype[key] = Mixin.prototype[key]
      }
    }
  }
}

mixin([
  AnnotationCommands,
  TextCommands,
  NodeCommands,
  MarkCommands,
  SelectionCommands,
  GeneralCommands,
  ElementQueries,
  GeneralQueries,
  LocationQueries,
  NodeQueries,
  RangeQueries,
])
