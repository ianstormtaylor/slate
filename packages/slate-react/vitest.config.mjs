import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      slate: path.resolve(import.meta.dirname, '../slate/src/index.ts'),
      'slate-dom': path.resolve(
        import.meta.dirname,
        '../slate-dom/src/index.ts'
      ),
      'slate-history': path.resolve(
        import.meta.dirname,
        '../slate-history/src/index.ts'
      ),
      'slate-hyperscript': path.resolve(
        import.meta.dirname,
        '../slate-hyperscript/src/index.ts'
      ),
      'slate-react': path.resolve(import.meta.dirname, './src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['test/bun/**'],
    globals: true,
    include: ['test/**/*.test.{ts,tsx}'],
    setupFiles: ['./test/vitest-setup.ts'],
  },
})
