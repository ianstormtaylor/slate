import { BaseSelection, Descendant, Operation } from '../../src'

export type BatchMatrixCase = Record<string, string> & {
  name: string
}

export type RunBatchReplayCaseArgs = {
  children: Descendant[]
  ops: Operation[]
  batchEntry: string
  wrapperMode?: string | null
  observationMode: string
  selection?: BaseSelection | null
  persistRefPath?: number[] | null
  compareDirtyPaths?: boolean
  compareOperations?: boolean
  createBatchEditor?: () => any
  createReplayEditor?: () => any
  assertResult?: (result: {
    batchEditor: any
    replayEditor: any
    batchSnapshots: Descendant[][]
    replaySnapshots: Descendant[][]
  }) => void
}

export function deepClone<T>(value: T): T
export function createMatrixCases(
  axes: Record<string, readonly string[] | string[]>
): BatchMatrixCase[]
export function runBatchReplayCase(args: RunBatchReplayCaseArgs): void
