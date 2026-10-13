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

Use separate emulator, example-server and DevTools ports for concurrent runs:

```sh
SLATE_PORT=3200 DEVTOOLS_PORT=9335 yarn node playwright/devices/android/run.cjs --serial emulator-5556 item35-second-composing-character-new-line
```

The `item35-*` scenarios add touch selection, suggestion replacement, sending during composition, paragraph formatting and scroll-container checks. Letter/digit, text/void, composing/committed and keyboard/touch controls distinguish input setup failures from the reported editing behavior. The image-tap cases substitute a local SVG for the example's remote image requests so they do not depend on the image host.

`tap` sends a trusted touch through Chrome DevTools at viewport coordinates and checks that it reached the requested element. This avoids screen-coordinate drift when Chrome shows or hides its toolbar; composing text still goes through Android InputConnection. `keyboardShown` reads Android's `mInputShown` state. `hideKeyboard` sends Android's Back key to establish a hidden-keyboard precondition before comparing text and mention taps. `composeSequence` sends composing prefixes without the usual per-step pause; adb transport still adds latency, so this does not model every fast physical keyboard.

Firefox for Android can be driven by geckodriver using `moz:firefoxOptions.androidPackage` and `androidDeviceSerial`. Complete its first-run screens and open a web page before waiting for a WebDriver session; the native home screen does not create a Marionette content window. WebDriver touch actions alone did not establish a test-keyboard input connection in the probe, while an adb touchscreen tap did. The Chrome runner is not a Firefox runner; verify both model and DOM when probing Firefox separately.
