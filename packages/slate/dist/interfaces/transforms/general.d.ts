import { Editor, Operation } from '../../index';
export interface GeneralTransforms {
    /**
     * Transform the editor by an operation.
     */
    transform: (editor: Editor, op: Operation) => void;
}
export declare const GeneralTransforms: GeneralTransforms;
//# sourceMappingURL=general.d.ts.map