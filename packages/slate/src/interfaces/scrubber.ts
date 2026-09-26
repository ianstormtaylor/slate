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
 * For example, to prevent the cleartext logging of 'text' fields within Nodes:
 *
 *    import { Scrubber } from 'slate';
 *    Scrubber.setScrubber((key, val) => {
 *      if (key === 'text') return '...scrubbed...'
 *      return val
 *    });
 *
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
