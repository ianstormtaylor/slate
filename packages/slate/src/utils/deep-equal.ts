import { isPlainObject } from 'is-plain-object'

/*
  Custom deep equal comparison for Slate nodes.

  We don't need general purpose deep equality;
  Slate only supports plain values, Arrays, and nested objects.
  Complex values nested inside Arrays are not supported.

  Slate objects are designed to be serialised, so
  missing keys are deliberately normalised to undefined.
 */
export const isDeepEqual = (
  node: Record<string, any>,
  another: Record<string, any>
): boolean => {
  for (const key in node) {
    const a = node[key]
    const b = another[key]
    if (isPlainObject(a) && isPlainObject(b)) {
      if (!isDeepEqual(a, b)) return false
    } else if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
      }
    } else if (a !== b) {
      return false
    }
  }

  /*
    Deep object equality is only necessary in one direction; in the reverse direction
    we are only looking for keys that are missing.
    As above, undefined keys are normalised to missing.
  */

  for (const key in another) {
    if (node[key] === undefined && another[key] !== undefined) {
      return false
    }
  }

  return true
}
