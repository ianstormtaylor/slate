import { RefObject } from 'react';
import { ReactEditor } from '../../plugin/react-editor';
export type RestoreDOMManager = {
    registerMutations: (mutations: MutationRecord[]) => void;
    restoreDOM: () => void;
    clear: () => void;
};
export declare const createRestoreDomManager: (editor: ReactEditor, receivedUserInput: RefObject<boolean>) => RestoreDOMManager;
//# sourceMappingURL=restore-dom-manager.d.ts.map