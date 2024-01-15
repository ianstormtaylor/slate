/// <reference types="react" />
import { DebouncedFunc } from 'lodash';
import { Point, Range } from 'slate';
import { ReactEditor } from '../../plugin/react-editor';
export type Action = {
    at?: Point | Range;
    run: () => void;
};
export type CreateAndroidInputManagerOptions = {
    editor: ReactEditor;
    scheduleOnDOMSelectionChange: DebouncedFunc<() => void>;
    onDOMSelectionChange: DebouncedFunc<() => void>;
};
export type AndroidInputManager = {
    flush: () => void;
    scheduleFlush: () => void;
    hasPendingDiffs: () => boolean;
    hasPendingAction: () => boolean;
    hasPendingChanges: () => boolean;
    isFlushing: () => boolean | 'action';
    handleUserSelect: (range: Range | null) => void;
    handleCompositionEnd: (event: React.CompositionEvent<HTMLDivElement>) => void;
    handleCompositionStart: (event: React.CompositionEvent<HTMLDivElement>) => void;
    handleDOMBeforeInput: (event: InputEvent) => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    handleDomMutations: (mutations: MutationRecord[]) => void;
    handleInput: () => void;
};
export declare function createAndroidInputManager({ editor, scheduleOnDOMSelectionChange, onDOMSelectionChange, }: CreateAndroidInputManagerOptions): AndroidInputManager;
//# sourceMappingURL=android-input-manager.d.ts.map