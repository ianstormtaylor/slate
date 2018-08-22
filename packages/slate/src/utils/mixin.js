/**
 * Mix in an `Interface` to a `Class`.
 *
 * @param {Class} Class
 * @param {Class} Interface
 */

export default function mixin(Interface, Classes) {
  for (const Class of Classes) {
    for (const name of Object.getOwnPropertyNames(Interface)) {
      if (Class.hasOwnProperty(name)) continue
      const desc = Object.getOwnPropertyDescriptor(Interface, name)
      Object.defineProperty(Class, name, desc)
    }

    for (const name of Object.getOwnPropertyNames(Interface.prototype)) {
      if (Class.prototype.hasOwnProperty(name)) continue
      const desc = Object.getOwnPropertyDescriptor(Interface.prototype, name)
      Object.defineProperty(Class.prototype, name, desc)
    }
  }
}
