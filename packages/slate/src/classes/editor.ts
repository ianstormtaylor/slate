import { produce } from 'immer'
import { Change, Path, PathRef, PointRef, RangeRef, Operation, Value } from '..'
import {
  DIRTY_PATHS,
  NORMALIZING,
  FLUSHING,
  PATH_REFS,
  POINT_REFS,
  RANGE_REFS,
} from '../symbols'
import AnnotationCommands from './commands/annotation'
import PathCommands from './commands/path'
import PointCommands from './commands/point'
import RangeCommands from './commands/range'
import SelectionCommands from './commands/selection'
import ValueCommands from './commands/value'
import MarkQueries from './queries/mark'
import NodeQueries from './queries/node'
import PathQueries from './queries/path'
import PointQueries from './queries/point'
import RangeQueries from './queries/range'
import ValueQueries from './queries/value'

/**
 * The `EditorConstructor` interface is provided as a convenience for plugins
 * who can use it when writing the typings for extending the `Editor` class.
 */

type EditorConstructor = new (...args: any[]) => Editor

/**
 * The `Editor` class stores all the state of a Slate editor. It is extended by
 * plugins that wish to add their own methods that implement new behaviors.
 */

class Editor {
  onChange: (change: Change) => void
  operations: Operation[]
  readOnly: boolean
  value: Value;
  [DIRTY_PATHS]: Path[];
  [FLUSHING]: boolean;
  [NORMALIZING]: boolean;
  [PATH_REFS]: { [key: number]: PathRef };
  [POINT_REFS]: { [key: number]: PointRef };
  [RANGE_REFS]: { [key: number]: RangeRef }

  constructor(props: {
    onChange?(change: Change): void
    readOnly?: boolean
    value?: Value
  }) {
    const {
      onChange = () => {},
      readOnly = false,
      value = produce(
        { nodes: [], selection: null, annotations: {} },
        () => {}
      ),
    } = props

    this.onChange = onChange
    this.operations = []
    this.readOnly = readOnly
    this.value = value
    this[DIRTY_PATHS] = []
    this[FLUSHING] = false
    this[NORMALIZING] = true
    this[PATH_REFS] = {}
    this[POINT_REFS] = {}
    this[RANGE_REFS] = {}
  }
}

interface Editor
  extends AnnotationCommands,
    PathCommands,
    PointCommands,
    RangeCommands,
    SelectionCommands,
    ValueCommands,
    MarkQueries,
    NodeQueries,
    PathQueries,
    PointQueries,
    RangeQueries,
    ValueQueries {}

Object.assign(
  Editor.prototype,
  AnnotationCommands.prototype,
  PathCommands.prototype,
  PointCommands.prototype,
  RangeCommands.prototype,
  SelectionCommands.prototype,
  ValueCommands.prototype,
  MarkQueries.prototype,
  NodeQueries.prototype,
  PathQueries.prototype,
  PointQueries.prototype,
  RangeQueries.prototype,
  ValueQueries.prototype
)

export { Editor, EditorConstructor }
