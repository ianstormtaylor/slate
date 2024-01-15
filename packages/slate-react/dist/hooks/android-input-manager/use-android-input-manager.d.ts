import { RefObject } from 'react';
import { CreateAndroidInputManagerOptions } from './android-input-manager';
type UseAndroidInputManagerOptions = {
    node: RefObject<HTMLElement>;
} & Omit<CreateAndroidInputManagerOptions, 'editor' | 'onUserInput' | 'receivedUserInput'>;
export declare const useAndroidInputManager: ({ node, ...options }: UseAndroidInputManagerOptions) => import("./android-input-manager").AndroidInputManager | null;
export {};
//# sourceMappingURL=use-android-input-manager.d.ts.map