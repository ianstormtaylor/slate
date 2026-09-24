---
'slate-react': patch
---

Declare `@types/react` (`>=18.0.0`) and `@types/lodash` (`^4.14.0`) as optional peer dependencies. The shipped type declarations import from `react` and `lodash` in type positions, but the typings packages were only listed in `devDependencies`. Under a hoisted `node_modules` layout that resolves by accident; under pnpm's isolated linker with a global virtual store it does not, and consumers get `TS7016` implicit-any errors (or silently degraded `any` props) for the editor components. Both entries are optional, so JavaScript-only consumers do not get unmet-peer warnings.
