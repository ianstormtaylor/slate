export type Scrubber = (key: string, value: unknown) => unknown

export interface ScrubberInterface {
  setScrubber(scrubber: Scrubber | undefined): void
  stringify(value: any): string
}

let _scrubber: Scrubber | undefined = undefined

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
// eslint-disable-next-line no-redeclare
export const Scrubber: ScrubberInterface = {
  setScrubber(scrubber: Scrubber | undefined): void {
    _scrubber = scrubber
  },

  stringify(value: any): string {
    return JSON.stringify(value, _scrubber)
  },
}
