import type { Editor } from '../interfaces/editor'

export type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never

export type OmitFirstArgWithSpecificGeneric<F, _TSpecific> = F extends (
  x: any,
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never

export type WithEditorFirstArg<T extends (...args: any) => any> = (
  editor: Editor,
  ...args: Parameters<T>
) => ReturnType<T>
