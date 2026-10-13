# Device and IME checks

These scripts drive the real input layer, where synthetic Playwright key events don't reach: OS input methods on macOS, and soft keyboards on Android. Each scenario opens an example, sends input through the OS, and compares the DOM, the Slate model and the selection after each step.

## macOS input methods

`macos/run.cjs` opens headed Chromium and Firefox and types through real macOS input sources (Pinyin, Japanese, Korean, Russian, dead keys) with `macos/ime-key.swift`. The OS input method does the composing.

Setup:

1. Give your terminal Accessibility access (System Settings > Privacy & Security > Accessibility). `ime-key trusted` prints `true` when it's set.
2. Start the examples: `yarn serve`.

Run:

```
yarn node playwright/devices/macos/run.cjs [--browsers chromium,firefox] [scenario-or-issue ...]
```

While it runs, the browser takes keyboard and mouse focus. Every key checks that the test browser is the frontmost app first, so switching to another app stops the run instead of typing into it. The original input source is restored afterwards.

Output is one line per scenario and browser: `PASS`, `FAIL` with the problems found, or `SKIP` when the input method didn't start composing after three tries. The `control-*` scenarios type into a plain textarea to confirm the input method works before blaming Slate.

Playwright's WebKit build runs as a background app that macOS won't give keyboard focus, so input methods can't reach it. Safari coverage needs real Safari instead.
