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

## Android soft keyboards

`android/run.cjs` drives Chrome on an Android emulator or a USB-connected phone. Input goes through `android/ime`, a small test keyboard app that makes the same Android input calls a keyboard like Gboard makes: set composing text, commit text, delete around the cursor, set the composing region, and key events. Chrome turns those into the same composition and `beforeinput` events a real keyboard produces.

Setup:

1. An emulator with Chrome (a Google Play system image) or a phone with USB debugging on. `adb devices` should list it.
2. Start the examples: `yarn serve`.

Run:

```
yarn node playwright/devices/android/run.cjs [--serial emulator-5554] [scenario-or-issue ...]
```

The script builds and installs the test keyboard on first use (needs the Android SDK build tools and a JDK), selects it, opens the example through `adb reverse`, and connects Playwright to Chrome's DevTools socket. It selects Gboard again when it finishes; set `KEEP_TEST_IME=1` to leave the test keyboard on.

The test keyboard sends the calls a scenario lists. Real keyboards differ in which calls they make and in what order, so a passing scenario shows Slate handles that sequence, not that every keyboard works.
