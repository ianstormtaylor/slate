import isPlainObject from 'is-plain-object'

/*
  Custom deep equal comparison for Slate nodes.

  We don't need general purpose deep equality;
  Slate only suports plain values and nested objects.

  Slate objects are designed to be serialised, so
  missing keys are deliberately normalised to undefined.
 */
export const isDeepEqual = (
  text: Record<string, any>,
  another: Record<string, any>
): boolean => {
  for (const key in text) {
    if (isPlainObject(text[key])) {
      return isDeepEqual(text[key], another[key])
    } else if (text[key] !== another[key]) {
      return false
    }
  }

  /*
    Deep object equality is only necessary in one direction.

    In the reverse direction we are only looking for missing keys.
  */

  for (const key in another) {
    if (text[key] !== another[key]) {
      return false
    }
  }

  return true
}
