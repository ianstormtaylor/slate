/**
 * Used by {@link ScrubberInterface} to scrub sensitive data from objects before they are stringified and logged.
 * it is run for each key of each object recursively. The top level object has a key of `""`.
 *
 * @param key The key of the current property being scrubbed.
 * @param value The value of the current property being scrubbed.
 * @returns The scrubbed value. If the value is an object, it will be recursively scrubbed.
 */
export type Scrubber = (key: string, value: unknown) => unknown

/**
 * This interface implements a stringify() function, which is used by Slate
 * internally when generating exceptions containing end user data. Developers
 * using Slate may call Scrubber.setScrubber() to alter the behavior of this
 * stringify() function.
 *
 * @example
 * For example, to prevent the cleartext logging of 'text' fields within Nodes:
 * ```ts
 * import { Scrubber } from 'slate';
 * Scrubber.setScrubber((key, val) => {
 *   if (key === 'text') return '...scrubbed...'
 *   return val
 * });
 * ```
 *
 * @example
 * Here's an example "textRandomizer" scrubber, which randomizes particular fields
 * of Nodes, preserving their length, but replacing their contents with randomly
 * chosen alphanumeric characters.
 *
 * ```ts
 * import { Scrubber } from 'slate'
 *
 * const textRandomizer = (fieldNames: string[]) => (key, value) => {
 *   if (fieldNames.includes(key)) {
 *     if (typeof value === 'string') {
 *       return value.split('').map(generateRandomCharacter).join('')
 *     } else {
 *       return '... scrubbed ...'
 *     }
 *   }
 *
 *   return value
 * }
 *
 * const generateRandomCharacter = (): string => {
 *   const chars =
 *     'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLKMNOPQRSTUVWXYZ1234567890'
 *   return chars.charAt(Math.floor(Math.random() * chars.length))
 * }
 *
 * // randomize the 'text' and 'src' fields of any Node that is included in an
 * // exception thrown by Slate
 * Scrubber.setScrubber(Scrubber.textRandomizer(['text', 'src']))
 * ```
 *
 * In this example, a Node that looked like:
 *
 * ```json
 * { "text": "My test input string", "count": 5 }
 * ```
 *
 * will be logged by Slate in an exception as (the random string will differ):
 *
 * ```json
 * { "text": "rSIvEzKe39l6rqQSCfyv", "count": 5 }
 * ```
 */
export interface ScrubberInterface {
  /**
   * Set the scrubber function.
   * @param scrubber The scrubber function to use on inputs of {@link Scrubber.stringify} and each of its properties, or `undefined` for no scrubbing
   */
  setScrubber(scrubber: Scrubber | undefined): void
  /**
   * Convert a value into a JSON string, using the scrubber function if one has been set.
   * @param value The value to stringify
   * @returns The JSON string representation of the value
   */
  stringify(value: any): string
}

let _scrubber: Scrubber | undefined = undefined

// eslint-disable-next-line no-redeclare
export const Scrubber: ScrubberInterface = {
  setScrubber(scrubber: Scrubber | undefined): void {
    _scrubber = scrubber
  },

  stringify(value: any): string {
    return JSON.stringify(value, _scrubber)
  },
}
