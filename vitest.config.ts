import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      './packages/{slate,slate-history,slate-hyperscript,slate-react}/test/**/*.test.{js,ts,tsx}',
    ],
    environment: 'jsdom',
  },
})
