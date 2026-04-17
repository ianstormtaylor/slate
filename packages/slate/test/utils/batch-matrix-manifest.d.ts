export interface BatchMatrixManifestEntry {
  count: number
  file: string
}

export declare const BATCH_MATRIX_MANIFEST: Record<
  string,
  BatchMatrixManifestEntry
>

export declare const assertBatchMatrixManifest: (
  id: string,
  actualCount: number
) => void
