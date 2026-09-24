import { isObject } from './is-object'

/**
 * Custom deep equal comparison for Slate nodes. Since Slate only supports plain
 * values, arrays and nested objects, we don't need a general purpose deep
 * equality check.
 *
 * Slate objects are designed to be serialised, so missing keys are deliberately
 * normalised to undefined.
 */
export const isDeepEqual = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false
    }
    return true
  }

  if (isObject(a) && isObject(b)) {
    for (const key in a) {
      const valueA = Object.hasOwn(a, key) ? a[key] : undefined
      const valueB = Object.hasOwn(b, key) ? b[key] : undefined
      if (!isDeepEqual(valueA, valueB)) return false
    }

    // Deep object equality is only necessary in one direction; in the reverse
    // direction we are only looking for keys that are missing. As above,
    // undefined keys treated the same as missing keys.

    for (const key in b) {
      if (a[key] === undefined && b[key] !== undefined) return false
    }

    return true
  }

  return a === b
}
