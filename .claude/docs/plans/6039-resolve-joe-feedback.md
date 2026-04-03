# PR 6039 Joe Feedback

## Goal

Resolve Joe (`12joan`) review feedback on `ianstormtaylor/slate#6039` from the local branch `6038-batched-set-node-prototype`, using the documented batch-engine design as the architecture guardrail.

## Phases

- [x] Identify the real PR and confirm local HEAD matches PR head
- [x] Read repo-local design context and affected code
- [x] Triage each Joe thread into fix, reply, or pushback
- [x] Implement code changes and targeted tests
- [x] Run required verification
- [ ] Reply on GitHub and resolve threads that are actually handled

## Findings

- The current local `../slate-2` HEAD matches PR `6039` head SHA `faa8f4687bd11184c265aff426392f4c3042f5d0`.
- The actual PR is upstream `ianstormtaylor/slate#6039`; local `gh pr view` missed it because `origin` is the fork `zbeyens/slate`.
- Batch-engine architecture and constraints are documented in `/Users/zbeyens/git/plate-2/.claude/docs/slate-v2/slate-batch-engine.md`.
- `../slate-2` has no local `AGENTS.md` and no `docs/solutions` / `.claude/docs/solutions` tree to mine.

## Thread Snapshot

- `docs/api/nodes/editor.md`: docs wording about `withBatch` vs `withoutNormalizing`
- `packages/slate/src/interfaces/transforms/general.ts`: same-parent move optimization comment/suggestion
- `packages/slate-dom/src/plugin/with-dom.ts`: missing intent comment
- `packages/slate-history/src/with-history.ts`: multiple cleanup / semantics questions
- `packages/slate-react/test/react-editor.spec.tsx`: removed assertion questioned
- `packages/slate/src/core/batching/direct-text-merge-batch-children.ts`: missing numeric guard
- `packages/slate/src/core/batching/direct-text-split-batch-children.ts`: missing numeric guard + dangerous property follow-up

## Progress

- Loaded required skills and pulled all unresolved review threads for Joe only.
- Read the design doc plus the touched files to decide which comments deserve code changes versus direct rebuttal.
- Implemented the code/doc/test changes for the valid review threads.
- Verification:
  - `yarn build:rollup`
  - `yarn lint:typescript`
  - `yarn eslint --fix ...touched files...`
  - `yarn prettier --write ...touched files...`
  - `yarn mocha --require ./config/babel/register.cjs ./packages/slate/test/with-batch.js ./packages/slate-history/test/redo-selection.js`
  - `yarn jest --config jest.config.js packages/slate-react/test/react-editor.spec.tsx --runInBand --coverage=false`
