export type Scrubber = (key: string, value: unknown) => unknown;
export interface ScrubberInterface {
    setScrubber(scrubber: Scrubber | undefined): void;
    stringify(value: any): string;
}
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
export declare const Scrubber: ScrubberInterface;
//# sourceMappingURL=scrubber.d.ts.map