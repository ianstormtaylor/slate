import { jsx as baseJsx } from '../src'

export const jsx = baseJsx

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
