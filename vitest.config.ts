import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      slate: '/packages/slate/src',
      'slate-history': '/packages/slate-history/src',
      'slate-hyperscript': '/packages/slate-hyperscript/src',
      'slate-react': '/packages/slate-react/src',
    },
  },
  test: {
    include: [
      './packages/{slate,slate-history,slate-hyperscript,slate-react}/test/**/*.test.{js,ts,tsx}',
    ],
    threads: false,
    environment: 'jsdom',
  },
})
