# slate-react

## 0.102.0

### Patch Changes

- [#5541](https://github.com/ianstormtaylor/slate/pull/5541) [`c2ae1eda`](https://github.com/ianstormtaylor/slate/commit/c2ae1eda91d0aae1cd63bd46af759c542c292a8a) Thanks [@12joan](https://github.com/12joan)! - Do not move selection outside inline node when composition starts

## 0.101.6

### Patch Changes

- [#5593](https://github.com/ianstormtaylor/slate/pull/5593) [`54594d0f`](https://github.com/ianstormtaylor/slate/commit/54594d0f81627166d72c97256203c4b5642a82ff) Thanks [@12joan](https://github.com/12joan)! - Fix: Calling `ReactEditor.focus` doesn't update `useFocused` when running in @testing-library/react

## 0.101.5

### Patch Changes

- [#5584](https://github.com/ianstormtaylor/slate/pull/5584) [`884ab424`](https://github.com/ianstormtaylor/slate/commit/884ab4249485e5930f1f79abb939bf375ffd47c0) Thanks [@Elvin7CF](https://github.com/Elvin7CF)! - Fix onCompositionEnd not updating isComposing

## 0.101.3

### Patch Changes

- [#5576](https://github.com/ianstormtaylor/slate/pull/5576) [`8ce52fd4`](https://github.com/ianstormtaylor/slate/commit/8ce52fd494c5156c8f08841b972bc5eda2817c03) Thanks [@qirong77](https://github.com/qirong77)! - fix onCompositionEnd update error.

## 0.101.2

### Patch Changes

- [#5567](https://github.com/ianstormtaylor/slate/pull/5567) [`07f59e36`](https://github.com/ianstormtaylor/slate/commit/07f59e36071bae2b9c09b787f1dd514c6bf859a4) Thanks [@timagixe](https://github.com/timagixe)! - Fix cursor position on selection collapse for RTL direction

## 0.101.1

### Patch Changes

- [#5564](https://github.com/ianstormtaylor/slate/pull/5564) [`9aa573e9`](https://github.com/ianstormtaylor/slate/commit/9aa573e9b8b2aff0c702fc6efa622e71db7759f1) Thanks [@12joan](https://github.com/12joan)! - Apply 300ms placeholder delay only on Android devices

## 0.101.0

### Minor Changes

- [#5527](https://github.com/ianstormtaylor/slate/pull/5527) [`fc081816`](https://github.com/ianstormtaylor/slate/commit/fc081816e08ade6838d05a96f84088de9f2734ce) Thanks [@skogsmaskin](https://github.com/skogsmaskin)! - Fixes a bug with `ReactEditor.focus` where it would throw an error if the editor was in the middle of applying pending operations.
  With this change, setting focus will be retried until the editor no longer has any pending operations.
  Calling `ReactEditor.focus` on a editor without a current selection, will now make a selection in the top of the document.

### Patch Changes

- [#5549](https://github.com/ianstormtaylor/slate/pull/5549) [`f9cca97f`](https://github.com/ianstormtaylor/slate/commit/f9cca97f00e4b7827f7056cd7f1644345a4be953) Thanks [@12joan](https://github.com/12joan)! - Firefox compat: Fix incorrect focus.offset when text node ends with \n

- [#5556](https://github.com/ianstormtaylor/slate/pull/5556) [`22495e14`](https://github.com/ianstormtaylor/slate/commit/22495e143d81fd602ff3efa0b5f6339a4b05b6c0) Thanks [@dylans](https://github.com/dylans)! - Revert #5542

## 0.100.1

### Patch Changes

- [#5542](https://github.com/ianstormtaylor/slate/pull/5542) [`8688ed5c`](https://github.com/ianstormtaylor/slate/commit/8688ed5c680069c4277d8b575b79fe525737935d) Thanks [@hellsan631](https://github.com/hellsan631)! - Fix Memory Leak when switching between focused editables

## 0.100.0

### Minor Changes

- [#5526](https://github.com/ianstormtaylor/slate/pull/5526) [`623f4452`](https://github.com/ianstormtaylor/slate/commit/623f44521ee95be38c53b6def456ed8c5f16e14b) Thanks [@jkcs](https://github.com/jkcs)! - Add `onSelectionChange` and `onValueChange` in Slate React component

- [#5528](https://github.com/ianstormtaylor/slate/pull/5528) [`c4c14882`](https://github.com/ianstormtaylor/slate/commit/c4c14882edf13828f6583a88e50754ce63583bd7) Thanks [@dylans](https://github.com/dylans)! - Update dependencies to React 18, Node 20, TS 5.2, etc.

## 0.99.0

### Minor Changes

- [#5516](https://github.com/ianstormtaylor/slate/pull/5516) [`300dc57a`](https://github.com/ianstormtaylor/slate/commit/300dc57a00c6437519ae0044384811efec653758) Thanks [@josephmr](https://github.com/josephmr)! - Retain editor selection when using ReactEditor.focus()

### Patch Changes

- [#5514](https://github.com/ianstormtaylor/slate/pull/5514) [`ff7db221`](https://github.com/ianstormtaylor/slate/commit/ff7db221205014605464628d18e41f1310bcead9) Thanks [@YaoKaiLun](https://github.com/YaoKaiLun)! - Fix move_node triggers nodes re-render

## 0.98.4

### Patch Changes

- [#5510](https://github.com/ianstormtaylor/slate/pull/5510) [`13c7d271`](https://github.com/ianstormtaylor/slate/commit/13c7d271e35406a2497e78ef114417ad17796c65) Thanks [@e1himself](https://github.com/e1himself)! - Remove an unused React ref

## 0.98.3

### Patch Changes

- [#5503](https://github.com/ianstormtaylor/slate/pull/5503) [`e308cd66`](https://github.com/ianstormtaylor/slate/commit/e308cd664d381ba1cd37f423445f189b9b5e4d1d) Thanks [@janpaepke](https://github.com/janpaepke)! - bugfix: slate breaks on load on safari < 16.4

## 0.98.2

### Patch Changes

- [#5497](https://github.com/ianstormtaylor/slate/pull/5497) [`76ba3759`](https://github.com/ianstormtaylor/slate/commit/76ba3759838fd538587fda2f4027f7c74ff09589) Thanks [@Dimitri-WEI-Lingfeng](https://github.com/Dimitri-WEI-Lingfeng)! - fix the bug that user cannot input chinese on mac wechat browser.

## 0.98.1

### Patch Changes

- [#5491](https://github.com/ianstormtaylor/slate/pull/5491) [`a5576e56`](https://github.com/ianstormtaylor/slate/commit/a5576e56a73f061972775953f270b34081a5cad8) Thanks [@WcaleNieWolny](https://github.com/WcaleNieWolny)! - Fix firefox table selection if table is contentedtiable

## 0.98.0

### Minor Changes

- [#5486](https://github.com/ianstormtaylor/slate/pull/5486) [`8b548fb5`](https://github.com/ianstormtaylor/slate/commit/8b548fb53af861e1f391f2d5c052e3279f0a0b6c) Thanks [@WcaleNieWolny](https://github.com/WcaleNieWolny)! - Fix invalid usage of the selection API in firefox

## 0.97.2

### Patch Changes

- [#5462](https://github.com/ianstormtaylor/slate/pull/5462) [`a6b606d8`](https://github.com/ianstormtaylor/slate/commit/a6b606d804795d9b134784a35e3b00ac77f3ebbc) Thanks [@Ben-Wormald](https://github.com/Ben-Wormald)! - Update hotkeys util to use isHotkey for better support for non-latin keyboards

* [#5470](https://github.com/ianstormtaylor/slate/pull/5470) [`4bd15ed3`](https://github.com/ianstormtaylor/slate/commit/4bd15ed3950e3a0871f5d0ecb391bb637c05e59d) Thanks [@josephmr](https://github.com/josephmr)! - Fix Android caret placement regression when inputting into empty editor

## 0.97.1

### Patch Changes

- [#5460](https://github.com/ianstormtaylor/slate/pull/5460) [`53395449`](https://github.com/ianstormtaylor/slate/commit/53395449e5b03fde5c0521203ef044064f3c159e) Thanks [@12joan](https://github.com/12joan)! - Do not attempt to batch updates manually in React >= 18

## 0.97.0

### Minor Changes

- [#5451](https://github.com/ianstormtaylor/slate/pull/5451) [`12ff246e`](https://github.com/ianstormtaylor/slate/commit/12ff246e101bb7ae51248066c07c378ee4be9220) Thanks [@gtluszcz](https://github.com/gtluszcz)! - Fixed occasional crashes when selecting void elements in Chrome

### Patch Changes

- [#5453](https://github.com/ianstormtaylor/slate/pull/5453) [`cde0a155`](https://github.com/ianstormtaylor/slate/commit/cde0a155e23d015d4ee72f9f10f63b67e878668e) Thanks [@Shiba-ligo](https://github.com/Shiba-ligo)! - fix regular expression for testing Webkit based browser.

## 0.96.0

### Minor Changes

- [#5437](https://github.com/ianstormtaylor/slate/pull/5437) [`3ad13d60`](https://github.com/ianstormtaylor/slate/commit/3ad13d601550341688cc75466a75b616d8232154) Thanks [@josephmr](https://github.com/josephmr)! - Detect all WebKit based browsers for COMPAT behavior

### Patch Changes

- [#5443](https://github.com/ianstormtaylor/slate/pull/5443) [`eb7f5987`](https://github.com/ianstormtaylor/slate/commit/eb7f598707ab9a4f1bd62fd195719049e9536be0) Thanks [@OldDream](https://github.com/OldDream)! - fix wrong caret position during composition.

## 0.95.0

### Minor Changes

- [#5422](https://github.com/ianstormtaylor/slate/pull/5422) [`0b179909`](https://github.com/ianstormtaylor/slate/commit/0b1799091a6800c7e868d5a6148b82648cbe8270) Thanks [@Chudesnov](https://github.com/Chudesnov)! - Prevents default focus styles from being removed in Editable

* [#5421](https://github.com/ianstormtaylor/slate/pull/5421) [`91e388ec`](https://github.com/ianstormtaylor/slate/commit/91e388ecd9e6a540b4a651978436f196f38f667d) Thanks [@e1himself](https://github.com/e1himself)! - Rename `<Slate>` component prop from `value` to `initialValue` to emphasize uncontrolled nature of it

## 0.94.2

### Patch Changes

- [#5423](https://github.com/ianstormtaylor/slate/pull/5423) [`042bca16`](https://github.com/ianstormtaylor/slate/commit/042bca167ac810acccae229bc905a49098aee546) Thanks [@horacioh](https://github.com/horacioh)! - fix placeholder position in Safari 16.x

## 0.94.0

### Patch Changes

- [#5307](https://github.com/ianstormtaylor/slate/pull/5307) [`3243c7e3`](https://github.com/ianstormtaylor/slate/commit/3243c7e34ac2602618c67c88b1b7df07fde1c2ec) Thanks [@zbeyens](https://github.com/zbeyens)! - Interface methods JSDoc should now work on IDEs.

## 0.93.0

### Patch Changes

- [#5383](https://github.com/ianstormtaylor/slate/pull/5383) [`3c3ea29a`](https://github.com/ianstormtaylor/slate/commit/3c3ea29a2d7c70bab3629f0f78ea28dca4058b53) Thanks [@12joan](https://github.com/12joan)! - Fix issue when tabbing into editor in Safari (https://github.com/udecode/plate/issues/2315)

* [#5368](https://github.com/ianstormtaylor/slate/pull/5368) [`5a0d3974`](https://github.com/ianstormtaylor/slate/commit/5a0d3974d6cb2c099dff4c0976e9390d24c345ad) Thanks [@edhager](https://github.com/edhager)! - Delay rendering of placeholder to avoid IME hiding

## 0.92.0

### Minor Changes

- [#5363](https://github.com/ianstormtaylor/slate/pull/5363) [`d42cd005`](https://github.com/ianstormtaylor/slate/commit/d42cd005db862165f5ac63fba4d35f36d92864f6) Thanks [@aciccarello](https://github.com/aciccarello)! - update dependencies on react hooks to be more senstive to changes

  The code should now meet eslint react hook standards

  This could result in more renders

  closes #3886

### Patch Changes

- [#5369](https://github.com/ianstormtaylor/slate/pull/5369) [`556a4565`](https://github.com/ianstormtaylor/slate/commit/556a4565d2bb4a611d34bb30ecd9bac324664066) Thanks [@alex-vladut](https://github.com/alex-vladut)! - Allow copying from editable void input

## 0.91.11

### Patch Changes

- [#5362](https://github.com/ianstormtaylor/slate/pull/5362) [`43999356`](https://github.com/ianstormtaylor/slate/commit/439993569001f8c5dc9e68194c198d430a4ef4bc) Thanks [@jason0x43](https://github.com/jason0x43)! - Fix an issue where pastes in Safari wouldn't include application/x-slate-fragment data

* [#5359](https://github.com/ianstormtaylor/slate/pull/5359) [`9825d29b`](https://github.com/ianstormtaylor/slate/commit/9825d29b87ffff96b4cdfd7339028cc1a92c6f68) Thanks [@jason0x43](https://github.com/jason0x43)! - Fix an issue on Android where content containing a newline wouldn't be pasted properly

## 0.91.10

### Patch Changes

- [#5346](https://github.com/ianstormtaylor/slate/pull/5346) [`a5e833f6`](https://github.com/ianstormtaylor/slate/commit/a5e833f6550a823689e593317f4579127d8a7fd7) Thanks [@edhager](https://github.com/edhager)! - Fix a problem with Editable not calling the decorate function passed as a prop when it should.

* [#5343](https://github.com/ianstormtaylor/slate/pull/5343) [`f7f02a8b`](https://github.com/ianstormtaylor/slate/commit/f7f02a8b23f16a3f3103302343e3326549917892) Thanks [@12joan](https://github.com/12joan)! - Fix error when triple-clicking a word preceding a `contenteditable="false"` DOM node in Chrome

## 0.91.9

### Patch Changes

- [#5339](https://github.com/ianstormtaylor/slate/pull/5339) [`62f8ddd9`](https://github.com/ianstormtaylor/slate/commit/62f8ddd9713617bf474968a10b69c24b71074b41) Thanks [@12joan](https://github.com/12joan)! - Fixes #5335. To prevent performance issues, make sure to wrap custom `renderPlaceholder` values in `useCallback`.

## 0.91.8

### Patch Changes

- [#5325](https://github.com/ianstormtaylor/slate/pull/5325) [`af3f828b`](https://github.com/ianstormtaylor/slate/commit/af3f828b1206409951708b823fb32965b67c798f) Thanks [@clauderic](https://github.com/clauderic)! - Fix edge-cases in the Android input manager when text leaf nodes are deleted, such as when deleting text leaf nodes adjacent to inline void nodes.

* [#5327](https://github.com/ianstormtaylor/slate/pull/5327) [`4205e0f0`](https://github.com/ianstormtaylor/slate/commit/4205e0f002929f575f34ef8bb5d3bf9d2670d9d7) Thanks [@YasinChan](https://github.com/YasinChan)! - Fix the issue of composition API and beforeinput event triggering between Chrome versions 60-75 on the Android platform.

## 0.91.7

### Patch Changes

- [#5322](https://github.com/ianstormtaylor/slate/pull/5322) [`836f6600`](https://github.com/ianstormtaylor/slate/commit/836f660054c6fd4ced793cfa28349543b8db9890) Thanks [@edhager](https://github.com/edhager)! - Add checks to Editable selection change handler to avoid errors

## 0.91.6

### Patch Changes

- [#5315](https://github.com/ianstormtaylor/slate/pull/5315) [`5784a38b`](https://github.com/ianstormtaylor/slate/commit/5784a38b6bd0f7de50efc890a4d6ceb8fafe191b) Thanks [@clauderic](https://github.com/clauderic)! - The `RestoreDOM` manager that is used Android no longer restores the DOM to its previous state for text mutations. This allows the editor state to be reconciled during a composition without interrupting the composition, as programatically updating the `textContent` of a text node ends the current composition.

* [#5315](https://github.com/ianstormtaylor/slate/pull/5315) [`5784a38b`](https://github.com/ianstormtaylor/slate/commit/5784a38b6bd0f7de50efc890a4d6ceb8fafe191b) Thanks [@clauderic](https://github.com/clauderic)! - Fixed consumer defined `onInput` event handler not being invoked when passed to the `<Editable>` component.

## 0.91.5

### Patch Changes

- [#5313](https://github.com/ianstormtaylor/slate/pull/5313) [`3bf568ed`](https://github.com/ianstormtaylor/slate/commit/3bf568ede2a1df91ff4f88402e0cdd848848f2fb) Thanks [@edhager](https://github.com/edhager)! - Some code clean-up in Editable.

* [#5306](https://github.com/ianstormtaylor/slate/pull/5306) [`213edbbf`](https://github.com/ianstormtaylor/slate/commit/213edbbf3abc407532aeda72e40d6f01d368c33c) Thanks [@clauderic](https://github.com/clauderic)! - Use memoization to avoid unnecessary `textContent` updates in `<TextString>` component.

## 0.91.4

### Patch Changes

- [#5310](https://github.com/ianstormtaylor/slate/pull/5310) [`b94254d6`](https://github.com/ianstormtaylor/slate/commit/b94254d694c6ea6c88cacd661e7bd77165cd2607) Thanks [@etrepum](https://github.com/etrepum)! - Fix to ensure that the latest versions of onChange and renderPlaceholder are used

## 0.91.3

### Patch Changes

- [#5305](https://github.com/ianstormtaylor/slate/pull/5305) [`11adbf96`](https://github.com/ianstormtaylor/slate/commit/11adbf966c764ffde866be38ada2d32e00105e48) Thanks [@alex-vladut](https://github.com/alex-vladut)! - Allow pasting plain text into editable voids

## 0.91.2

### Patch Changes

- [#5297](https://github.com/ianstormtaylor/slate/pull/5297) [`967d99eb`](https://github.com/ianstormtaylor/slate/commit/967d99eb36df798ac3163c7d15a01e64fee0668c) Thanks [@edhager](https://github.com/edhager)! - Fix memory leaks by adding clean-up code that looks for ref resets in Editable and Text.

## 0.91.1

### Patch Changes

- [#5251](https://github.com/ianstormtaylor/slate/pull/5251) [`6fa4b954`](https://github.com/ianstormtaylor/slate/commit/6fa4b954a5e4c67cff87d00b1253b2a838c0db94) Thanks [@YaoKaiLun](https://github.com/YaoKaiLun)! - Fix the cursor jump to an unexpected position after deleting in android

## 0.91.0

### Minor Changes

- [#5267](https://github.com/ianstormtaylor/slate/pull/5267) [`463edbd2`](https://github.com/ianstormtaylor/slate/commit/463edbd27ed78a4b4a3d38886da4d9e3e8b8efd5) Thanks [@ilya2204](https://github.com/ilya2204)! - Allow to change clipboard fragment format name

* [#5271](https://github.com/ianstormtaylor/slate/pull/5271) [`9635b992`](https://github.com/ianstormtaylor/slate/commit/9635b992a0d91cecd45e3b6a883a860f14bcaaea) Thanks [@dsvgit](https://github.com/dsvgit)! - If TextComponent decorations keep the same offsets and only paths are changed, prevent re-rendering because only decoration offsets matter when leaves are calculated.

## 0.90.0

### Minor Changes

- [#5278](https://github.com/ianstormtaylor/slate/pull/5278) [`9c4097a2`](https://github.com/ianstormtaylor/slate/commit/9c4097a26fa92718e6f4fc1f984a70fb5af42ca2) Thanks [@kylemclean](https://github.com/kylemclean)! - Revert to using inline styles for default editor styles

## 0.89.0

### Minor Changes

- [#5275](https://github.com/ianstormtaylor/slate/pull/5275) [`5bc69d8d`](https://github.com/ianstormtaylor/slate/commit/5bc69d8d657c57eef06aeaa1fa198840d36939c7) Thanks [@12joan](https://github.com/12joan)! - Firefox: fix wrong text highlighting with double-click

### Patch Changes

- [#5265](https://github.com/ianstormtaylor/slate/pull/5265) [`3cf51f4d`](https://github.com/ianstormtaylor/slate/commit/3cf51f4d88e8e91faa6ab5d1f2c5f8c8e505ae89) Thanks [@kylemclean](https://github.com/kylemclean)! - Improve compatibility for browsers that do not support ResizeObserver or :where selector

## 0.88.2

### Patch Changes

- [#5259](https://github.com/ianstormtaylor/slate/pull/5259) [`d7de564d`](https://github.com/ianstormtaylor/slate/commit/d7de564d62848dd8e14535993083c5e9aa1bfacc) Thanks [@Jacfem](https://github.com/Jacfem)! - Updates the selection correctly in readonly shadowdom

* [#5252](https://github.com/ianstormtaylor/slate/pull/5252) [`179d5c92`](https://github.com/ianstormtaylor/slate/commit/179d5c926eecfdb2b3d8a75c07cb89181c348ad1) Thanks [@frellica](https://github.com/frellica)! - remove qq browser from `beforeinput` compat list because it had updated its chromium core to version 94

## 0.88.0

### Minor Changes

- [#5226](https://github.com/ianstormtaylor/slate/pull/5226) [`0141f683`](https://github.com/ianstormtaylor/slate/commit/0141f683659025c7e851c11274cf200da05fd31e) Thanks [@laufeyrut](https://github.com/laufeyrut)! - Check if getBoundingClientRect exist before trying to call bind on it. Makes unit testing experience agains Editable nicer

## 0.87.1

### Patch Changes

- [#5223](https://github.com/ianstormtaylor/slate/pull/5223) [`120437d6`](https://github.com/ianstormtaylor/slate/commit/120437d61237eeb8df4ed0db92af31698e910eda) Thanks [@alex-vladut](https://github.com/alex-vladut)! - Fix issue preventing editing and copy/paste into editable voids

## 0.87.0

### Minor Changes

- [#5206](https://github.com/ianstormtaylor/slate/pull/5206) [`96b7fcdb`](https://github.com/ianstormtaylor/slate/commit/96b7fcdbf98a7c8908f5d9613d9898cb24a8ae47) Thanks [@kylemclean](https://github.com/kylemclean)! - Use stylesheet for default styles on Editable components

## 0.86.0

### Minor Changes

- [#5121](https://github.com/ianstormtaylor/slate/pull/5121) [`06942c6d`](https://github.com/ianstormtaylor/slate/commit/06942c6d7e4b8418a467f022750b010491dbdbe7) Thanks [@laufeyrut](https://github.com/laufeyrut)! - Make it possible to copy/paste void elements

## 0.83.2

### Patch Changes

- [#5148](https://github.com/ianstormtaylor/slate/pull/5148) [`a2b6786d`](https://github.com/ianstormtaylor/slate/commit/a2b6786d19f8bd5f779c526742a4dc3da971f696) Thanks [@ksimons](https://github.com/ksimons)! - Ensure the min-height for placeholders is set on the correct editor
- [#5155](https://github.com/ianstormtaylor/slate/pull/5154) [`1b14de5`](https://github.com/ianstormtaylor/slate/commit/1b14de5f8e5961ac36eced229abea9abb5be71f9) Thanks [@jameshfisher](https://github.com/jameshfisher) - Revert insertText breaking change that deletes fragment

## 0.83.1

### Patch Changes

- [#5143](https://github.com/ianstormtaylor/slate/pull/5143) [`347865ca`](https://github.com/ianstormtaylor/slate/commit/347865cafc1f2f3b0fc3d74d8758e082480df6ca) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Fix scrollIntoView when selection is collapsed inside mark placeholder

## 0.83.0

### Minor Changes

- [#5123](https://github.com/ianstormtaylor/slate/pull/5123) [`0eb37e79`](https://github.com/ianstormtaylor/slate/commit/0eb37e79150275d3535f1694d8972751a83d826f) Thanks [@laufeyrut](https://github.com/laufeyrut)! - Make it possible to delete block elements with backspace in Chrome and Safari

### Patch Changes

- [#5127](https://github.com/ianstormtaylor/slate/pull/5127) [`341041f0`](https://github.com/ianstormtaylor/slate/commit/341041f0b721926cca3f9dee98dc4589f2c96797) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Cleanup and fix insertion placeholder mark compare

## 0.82.2

### Patch Changes

- [#5120](https://github.com/ianstormtaylor/slate/pull/5120) [`9815bdab`](https://github.com/ianstormtaylor/slate/commit/9815bdabdd34221ed86f68b556cfa43d845e2db0) Thanks [@hueyhe](https://github.com/hueyhe)! - Fix editor selection out of sync in readonly mode

* [#5100](https://github.com/ianstormtaylor/slate/pull/5100) [`8eb1972b`](https://github.com/ianstormtaylor/slate/commit/8eb1972b5b2f9489936b1759afb76574040af5a0) Thanks [@KittyGiraudel](https://github.com/KittyGiraudel)! - Add `aria-multiline` attribute to textbox editor

- [#5105](https://github.com/ianstormtaylor/slate/pull/5105) [`55b95740`](https://github.com/ianstormtaylor/slate/commit/55b9574097f6008bda7ed8e3cb7aa9dd607d9f49) Thanks [@yume-chan](https://github.com/yume-chan)! - Change `Element` component to use callback-style ref to reliably track DOM node of rendered custom elements

## 0.82.1

### Patch Changes

- [#5084](https://github.com/ianstormtaylor/slate/pull/5084) [`50de780b`](https://github.com/ianstormtaylor/slate/commit/50de780b1c32fa2c52ad88d42031748f9d3944e9) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Fix selection handling with slow flush in mark placeholders on android, fix auto-capitalize after placeholder

* [#5091](https://github.com/ianstormtaylor/slate/pull/5091) [`e18879e7`](https://github.com/ianstormtaylor/slate/commit/e18879e728077b09580b29e9a6683aaa66629bc5) Thanks [@e1himself](https://github.com/e1himself)! - Fix `withReact()` function type definition

## 0.82.0

### Minor Changes

- [#5041](https://github.com/ianstormtaylor/slate/pull/5041) [`9bc0b613`](https://github.com/ianstormtaylor/slate/commit/9bc0b6132aa288a37ae9a85d0e59a9d5a75ebdd7) Thanks [@bryanph](https://github.com/bryanph)! - - Introduces a `useSlateSelection` hook that triggers whenever the selection changes.
  - This also changes the implementation of SlateContext to use an incrementing value instead of an array replace to trigger updates
  - Introduces a `useSlateWithV` hook that includes the version counter which can be used to prevent re-renders

* [#4988](https://github.com/ianstormtaylor/slate/pull/4988) [`fbab6331`](https://github.com/ianstormtaylor/slate/commit/fbab6331a5ecebd9e98c6c8c87d6f4b3b7c43bd0) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Android input handling rewrite, replace composition insert prefixes with decoration based mark placeholders

## 0.81.3

### Patch Changes

- [#5054](https://github.com/ianstormtaylor/slate/pull/5054) [`1cc0797f`](https://github.com/ianstormtaylor/slate/commit/1cc0797f53f22e650198c83192ba5fc35c525a15) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Fix toSlatePoint in void nodes with nested editors if children are rendered as the last child

* [#5042](https://github.com/ianstormtaylor/slate/pull/5042) [`11a93e65`](https://github.com/ianstormtaylor/slate/commit/11a93e65de4b197a43777e575caf13d7a05d5dc9) Thanks [@bryanph](https://github.com/bryanph)! - Upgrade next.js and source-map-loader packages

## 0.81.2

### Patch Changes

- [#5045](https://github.com/ianstormtaylor/slate/pull/5045) [`0b2e6c79`](https://github.com/ianstormtaylor/slate/commit/0b2e6c79c08fc4eba32be7a424da758ba74573c3) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Don't native insert inside blocks with whitespace="pre" containing tab chars to work around https://bugs.chromium.org/p/chromium/issues/detail?id=1219139

* [#5046](https://github.com/ianstormtaylor/slate/pull/5046) [`f96b6597`](https://github.com/ianstormtaylor/slate/commit/f96b659755673375ef1b6a1cc925c73ce4934a03) Thanks [@BitPhinix](https://github.com/BitPhinix)! - fix macos accent menu when using arrow keys

## 0.81.0

### Minor Changes

- [#4999](https://github.com/ianstormtaylor/slate/pull/4999) [`fe13a8f9`](https://github.com/ianstormtaylor/slate/commit/fe13a8f9e750569342ee004951e34233ab6614bf) Thanks [@alexandercampbell](https://github.com/alexandercampbell)! - Add new Slate.Scrubber interface to allow scrubbing end user data from exception
  text. The default behavior remains unchanged.

## 0.80.0

### Patch Changes

- [#5007](https://github.com/ianstormtaylor/slate/pull/5007) [`92c5730a`](https://github.com/ianstormtaylor/slate/commit/92c5730a96223a683b3c95651eb4c90a5caca21a) Thanks [@jasonphillips](https://github.com/jasonphillips)! - Revert #4876 & #4910 to restore original decorations behavior

## 0.79.0

### Minor Changes

- [#4981](https://github.com/ianstormtaylor/slate/pull/4981) [`cb8a5515`](https://github.com/ianstormtaylor/slate/commit/cb8a551508c023346fd3aa0af1a5a80ffd6a37cd) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Add `ReactEditor.isComposing(editor)` to get the current `isComposing` state

## 0.78.1

### Patch Changes

- [#4979](https://github.com/ianstormtaylor/slate/pull/4979) [`6afa9f6a`](https://github.com/ianstormtaylor/slate/commit/6afa9f6a719092368b92dc3342e21e44d457d77e) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Unset isComposing on keydown with isCompsing false

## 0.77.4

### Patch Changes

- [#4965](https://github.com/ianstormtaylor/slate/pull/4965) [`a4536e2a`](https://github.com/ianstormtaylor/slate/commit/a4536e2aa2703d4c4460a54f87997ce76a722689) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Fix triple click handling in nested blocks

## 0.77.3

### Patch Changes

- [#4957](https://github.com/ianstormtaylor/slate/pull/4957) [`c1e3fbaa`](https://github.com/ianstormtaylor/slate/commit/c1e3fbaab969f2e78303f9ba00f26b88c575cdd1) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Don't treat events with non-selection target range as native

## 0.77.2

### Patch Changes

- [#4951](https://github.com/ianstormtaylor/slate/pull/4951) [`5b51e87d`](https://github.com/ianstormtaylor/slate/commit/5b51e87d511e3a8c05a679903650cb256f3bf044) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Fix double insert in anchor element decorations

## 0.77.1

### Patch Changes

- [#4948](https://github.com/ianstormtaylor/slate/pull/4948) [`9957c214`](https://github.com/ianstormtaylor/slate/commit/9957c214357dbbd5492ec4761fd6e1c7b14310f5) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Prevent native insert at the end of anchor elements

## 0.77.0

### Minor Changes

- [#4926](https://github.com/ianstormtaylor/slate/pull/4926) [`076ab9a6`](https://github.com/ianstormtaylor/slate/commit/076ab9a67a5d7bf54062e551e6c29b1464da7e99) Thanks [@Auralytical](https://github.com/Auralytical)! - Fix firefox three digit version check

### Patch Changes

- [#4944](https://github.com/ianstormtaylor/slate/pull/4944) [`486c385b`](https://github.com/ianstormtaylor/slate/commit/486c385bc52ae76890f67ee9e8965955a6de3f61) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Fix crash when tripple clicking editor root

## 0.76.1

### Patch Changes

- [#4923](https://github.com/ianstormtaylor/slate/pull/4923) [`08d5a12c`](https://github.com/ianstormtaylor/slate/commit/08d5a12c9131c715ba75d3cc6f87108f8e6a8f59) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Call keyDown handler while composing

* [#4920](https://github.com/ianstormtaylor/slate/pull/4920) [`f6b7ca1f`](https://github.com/ianstormtaylor/slate/commit/f6b7ca1f97bcc9e6136ab6ba6c7e9bcb1c4fd9bb) Thanks [@adri1wald](https://github.com/adri1wald)! - fix useFocused hook in react >= 17

- [#4914](https://github.com/ianstormtaylor/slate/pull/4914) [`aff67312`](https://github.com/ianstormtaylor/slate/commit/aff67312cbfa7e45df5cf6abcaec9f4f7d5f1a89) Thanks [@sennpang](https://github.com/sennpang)! - Fixed Triple click selection and copy&paste in read-only mode

* [#4919](https://github.com/ianstormtaylor/slate/pull/4919) [`7de7cdcf`](https://github.com/ianstormtaylor/slate/commit/7de7cdcf5625d44dbb2dc9faf52675374e51499f) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Restore user selection after applying beforeinput with target range

- [#4922](https://github.com/ianstormtaylor/slate/pull/4922) [`9892cf0f`](https://github.com/ianstormtaylor/slate/commit/9892cf0ffbd741cc2880d1f0bd0d7c1b36145bbd) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Make Slate component onChange optional

## 0.76.0

### Minor Changes

- [#4873](https://github.com/ianstormtaylor/slate/pull/4873) [`20acca4b`](https://github.com/ianstormtaylor/slate/commit/20acca4bc8f31bd1aa6fbca2c49aaae5f31cadfe) Thanks [@bryanph](https://github.com/bryanph)! - A different behavior for inserting a soft break with shift+enter is quite common in rich text editors. Right now you have to do this in onKeyDown which is not so nice. This adds a separate insertSoftBreak method on the editor instance that gets called when a soft break is inserted. This maintains the current default behavior for backwards compatibility (it just splits the block). But at least you can easily overwrite it now.

  If you rely on overwriting editor.insertBreak for extra behavior for soft breaks this might be a breaking change for you and you should overwrite editor.insertSoftBreak instead.

### Patch Changes

- [#4901](https://github.com/ianstormtaylor/slate/pull/4901) [`5ef346fe`](https://github.com/ianstormtaylor/slate/commit/5ef346feb9e6430b3b6af66f196e5445a9ee3ff2) Thanks [@bryanph](https://github.com/bryanph)! - Fixes a bug where nodes remounted on split_node and merge_node

* [#4885](https://github.com/ianstormtaylor/slate/pull/4885) [`07669dca`](https://github.com/ianstormtaylor/slate/commit/07669dca4b0641506ca857bd781c460dae7606a9) Thanks [@ryanmitts](https://github.com/ryanmitts)! - toSlatePoint should not consider a selection within a void node if the void node isn't in the editor itself.

  Prior to this fix, a nested Slate editor inside a void node in a parent editor would not allow you to start typing text in a blank editor state correctly. After the first character insertion, the selection would jump back to the start of the nested editor.

- [#4910](https://github.com/ianstormtaylor/slate/pull/4910) [`2a8d86f1`](https://github.com/ianstormtaylor/slate/commit/2a8d86f1a40bcc806422e6fe3658ddd810ce73a5) Thanks [@jasonphillips](https://github.com/jasonphillips)! - Fix decorations applied across nested elements

## 0.75.0

### Minor Changes

- [#4883](https://github.com/ianstormtaylor/slate/pull/4883) [`3b3b0e32`](https://github.com/ianstormtaylor/slate/commit/3b3b0e32df4df9fb4cf1d82c0c09b7242c708169) Thanks [@always-maap](https://github.com/always-maap)! - Fix chrome and edge three digit version check

## 0.74.2

### Patch Changes

- [#4876](https://github.com/ianstormtaylor/slate/pull/4876) [`1b205c08`](https://github.com/ianstormtaylor/slate/commit/1b205c087bef2f2360679c46801804d6d30a8139) Thanks [@nemanja-tosic](https://github.com/nemanja-tosic)! - Fix decorations not getting applied for children unless parent changes
- [#4874](https://github.com/ianstormtaylor/slate/pull/4874) [`4d28948`](https://github.com/ianstormtaylor/slate/commit/4d28948b901b1724493dd0a782e3001149546533) Thanks [@bryanph](https://github.com/bryanph)! - Revert #4755

## 0.74.1

### Patch Changes

- [#4868](https://github.com/ianstormtaylor/slate/pull/4868) [`7499d4b4`](https://github.com/ianstormtaylor/slate/commit/7499d4b4c01a089906a96f30f6c04256204ca65e) Thanks [@sennpang](https://github.com/sennpang)! - fixed cursor when triple clicking on text and type over it, fixes #4862

## 0.74.0

### Minor Changes

- [#4841](https://github.com/ianstormtaylor/slate/pull/4841) [`47f2403e`](https://github.com/ianstormtaylor/slate/commit/47f2403e3a46d84b8d8f99c6e2bf41f2699e30df) Thanks [@Fibs7000](https://github.com/Fibs7000)! - Added redux-style useSlateSelector to improve and prevent unneccessary rerendering with the useSlate hook

## 0.73.0

### Patch Changes

- [#4840](https://github.com/ianstormtaylor/slate/pull/4840) [`100448d5`](https://github.com/ianstormtaylor/slate/commit/100448d55c018351d5a5ffbe18efa207e668f1fb) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Render void spacer in readonly mode

## 0.72.9

### Patch Changes

- [#4828](https://github.com/ianstormtaylor/slate/pull/4828) [`d5ac8237`](https://github.com/ianstormtaylor/slate/commit/d5ac82373b97e389528688ec6dbc7c72715cc360) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Reset isDraggingInternally onDragEnd and onDrop even if the event is handled by the editable handler

* [#4819](https://github.com/ianstormtaylor/slate/pull/4819) [`80661509`](https://github.com/ianstormtaylor/slate/commit/80661509ecf39b5d8256fa387c7eff15f60bf612) Thanks [@ugaya40](https://github.com/ugaya40)! - Fix a possible update of react state after Slate component is unmounted

## 0.72.8

### Patch Changes

- [#4816](https://github.com/ianstormtaylor/slate/pull/4816) [`6d62abc1`](https://github.com/ianstormtaylor/slate/commit/6d62abc1039cf93ce90bd9332a505471df8118ba) Thanks [@dylans](https://github.com/dylans)! - - Revert #4749, DOM & Slate selection are mismatching

## 0.72.7

### Patch Changes

- [#4813](https://github.com/ianstormtaylor/slate/pull/4813) [`a5fd62dd`](https://github.com/ianstormtaylor/slate/commit/a5fd62ddd646553841a54616f7a5528e310bfd22) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Don't throw in toSlatePoint while using supressThrow if leaf has no text node

* [#4798](https://github.com/ianstormtaylor/slate/pull/4798) [`3796c514`](https://github.com/ianstormtaylor/slate/commit/3796c514d6da0db8656486151147d92e73a2350a) Thanks [@hueyhe](https://github.com/hueyhe)! - Fix text not rendered on ssr

- [#4809](https://github.com/ianstormtaylor/slate/pull/4809) [`e9987529`](https://github.com/ianstormtaylor/slate/commit/e9987529895d3ef2740f8f466a9ef9ce4c3e37c2) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Flush onDOMSelectionChange on onDOMBeforeInput

## 0.72.6

### Patch Changes

- [#4796](https://github.com/ianstormtaylor/slate/pull/4796) [`5d8a1606`](https://github.com/ianstormtaylor/slate/commit/5d8a16066949981ead34466af26bcb8e4ffa994b) Thanks [@hueyhe](https://github.com/hueyhe)! - Fix text not rendered on server-side rendering

## 0.72.5

### Patch Changes

- [#4749](https://github.com/ianstormtaylor/slate/pull/4749) [`a3dfb151`](https://github.com/ianstormtaylor/slate/commit/a3dfb151d432ec67f10847997fc71b009bcf5c00) Thanks [@Jabher](https://github.com/Jabher)! - Fix "cannot resolve DOM point" error when switching between multiple errors

## 0.72.4

### Patch Changes

- [#4753](https://github.com/ianstormtaylor/slate/pull/4753) [`e9a46ad2`](https://github.com/ianstormtaylor/slate/commit/e9a46ad29e0376a45051c4a8100c5678784b785c) Thanks [@alessiogaldy](https://github.com/alessiogaldy)! - Fix "editor.insertText never gets called inside plugins on android"

* [#4779](https://github.com/ianstormtaylor/slate/pull/4779) [`345b8fc9`](https://github.com/ianstormtaylor/slate/commit/345b8fc9e8f073674c006098bd843823309db2e2) Thanks [@alessiogaldy](https://github.com/alessiogaldy)! - Android editable updates

  - Remove logic to delay handling of text insertion
  - Call Transforms.setSelection before Editor.insertText to adjust position

- [#4786](https://github.com/ianstormtaylor/slate/pull/4786) [`67aa1f10`](https://github.com/ianstormtaylor/slate/commit/67aa1f10106e15486031b4103285c7fae4373056) Thanks [@alessiogaldy](https://github.com/alessiogaldy)! - - Restore logic to delay text insertion on android
  - Always call Trasform.setSelection before calling Editor.insertText

* [#4755](https://github.com/ianstormtaylor/slate/pull/4755) [`8daa77e9`](https://github.com/ianstormtaylor/slate/commit/8daa77e9fab6b222ad796b420b86f3ec88999a39) Thanks [@jhurwitz](https://github.com/jhurwitz)! - fix useFocused hook

- [#4788](https://github.com/ianstormtaylor/slate/pull/4788) [`a8c08a4e`](https://github.com/ianstormtaylor/slate/commit/a8c08a4e0107bccfe972149a512643fbbfcfb9bf) Thanks [@YasinChan](https://github.com/YasinChan)! - Android merge `Editor.insertText` logic.

## 0.72.2

### Patch Changes

- [#4734](https://github.com/ianstormtaylor/slate/pull/4734) [`3c07a870`](https://github.com/ianstormtaylor/slate/commit/3c07a8706ef152fe35c5363a2316aa291c12c2f0) Thanks [@YasinChan](https://github.com/YasinChan)! - [AndroidEditor] Solve input association problems and add click events.
- [#4733](https://github.com/ianstormtaylor/slate/pull/4733) [`ccafb69`](https://github.com/ianstormtaylor/slate/commit/ccafb6982f56364becc8ca39ed6c1953a5febac3) Thanks [@Schipy](https://github.com/Schipy)! - Optimize TextString rendering to support browser/OS text features, e.g. fix native spellcheck.

## 0.72.1

### Patch Changes

- [#4720](https://github.com/ianstormtaylor/slate/pull/4720) [`1217021a`](https://github.com/ianstormtaylor/slate/commit/1217021a9a42563c9ee951ab670255c209863452) Thanks [@bryanph](https://github.com/bryanph)! - Add origin event type to setFragmentData to be able to distinguish copy, cut and drag

* [#4727](https://github.com/ianstormtaylor/slate/pull/4727) [`0334851c`](https://github.com/ianstormtaylor/slate/commit/0334851cb1da3fd194278e48985166eb658eaf24) Thanks [@ahoisl](https://github.com/ahoisl)! - Fix "Cannot resolve from DOM point" error on onDomSelectionChange for readonly void elements

## 0.72.0

### Minor Changes

- [#4702](https://github.com/ianstormtaylor/slate/pull/4702) [`8bc6a464`](https://github.com/ianstormtaylor/slate/commit/8bc6a464600d6820d85f55fdaf71e9ea01702eb5) Thanks [@ttitoo](https://github.com/ttitoo)! - Fix CJK IME (e.g. Chinese or Japanese) double input

### Patch Changes

- [#4706](https://github.com/ianstormtaylor/slate/pull/4706) [`6d194077`](https://github.com/ianstormtaylor/slate/commit/6d194077763ec0a9d5642be5cafef20e65dbce8e) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Update android restoreDOM to use partial dom restoring

* [#4707](https://github.com/ianstormtaylor/slate/pull/4707) [`c020ca23`](https://github.com/ianstormtaylor/slate/commit/c020ca23b6f5d2307eb62630566ec711def89fcf) Thanks [@ahoisl](https://github.com/ahoisl)! - fix: add 'readonly' dependency for onDragStart callback

## 0.71.0

### Minor Changes

- [#4682](https://github.com/ianstormtaylor/slate/pull/4682) [`e5380655`](https://github.com/ianstormtaylor/slate/commit/e53806557217b08bce6217b7d871cd5ae7dad31c) Thanks [@matthewkeil](https://github.com/matthewkeil)! - Support SSR for autoCorrect, spellCheck and autoCapitalize.
  Fixes prop mismatch between server and client.
  Removes the need to add
  <Editable
    spellCheck={false}
    autoCorrect="false"
    autoCapitalize="false"
  />

## 0.70.2

### Patch Changes

- [#4669](https://github.com/ianstormtaylor/slate/pull/4669) [`807716d7`](https://github.com/ianstormtaylor/slate/commit/807716d7dfb0fa5791cdcdfeaf4ac027a003127b) Thanks [@BitPhinix](https://github.com/BitPhinix)! - Flush scheduleOnDOMSelectionChange on beforeinput

* [#4661](https://github.com/ianstormtaylor/slate/pull/4661) [`0f194a86`](https://github.com/ianstormtaylor/slate/commit/0f194a86a08d5de07e58e20fb95c9dc760e9d52d) Thanks [@leoc4e](https://github.com/leoc4e)! - use ownerDocument to create element

## 0.70.1

### Patch Changes

- [#4654](https://github.com/ianstormtaylor/slate/pull/4654) [`2c7750ca`](https://github.com/ianstormtaylor/slate/commit/2c7750cac5949a935a570a9590a82187673b9a44) Thanks [@anho](https://github.com/anho)! - weak guard on DataTransfer to not rely on current window

* [#4652](https://github.com/ianstormtaylor/slate/pull/4652) [`95389ed7`](https://github.com/ianstormtaylor/slate/commit/95389ed7b03487aa066af277afcccba440c32f24) Thanks [@karthikcodes6](https://github.com/karthikcodes6)! - Disabled the auto scroll behaviour when the editor has any active selection

- [#4650](https://github.com/ianstormtaylor/slate/pull/4650) [`b6643132`](https://github.com/ianstormtaylor/slate/commit/b6643132f1f3b64f019a601ee2f44a521c122ad3) Thanks [@e1himself](https://github.com/e1himself)! - Do not disable Grammarly extension in Slate editors

## 0.70.0

### Patch Changes

- [#4636](https://github.com/ianstormtaylor/slate/pull/4636) [`9e8d5e2b`](https://github.com/ianstormtaylor/slate/commit/9e8d5e2b9bbff1ec7161e292635a074ba3538774) Thanks [@cmmartin](https://github.com/cmmartin)! - Fixes drop actions in editors rendered in iFrames.

## 0.69.0

### Minor Changes

- [#4625](https://github.com/ianstormtaylor/slate/pull/4625) [`e54f2a0e`](https://github.com/ianstormtaylor/slate/commit/e54f2a0ea01ddc94f3ad14e812602b0ed824aeb3) Thanks [@echarles](https://github.com/echarles)! - insertTextData and insertFragmentData return a boolean (true if some content has been effectively inserted)

## 0.68.1

### Patch Changes

- [#4627](https://github.com/ianstormtaylor/slate/pull/4627) [`ec01e75f`](https://github.com/ianstormtaylor/slate/commit/ec01e75fff29b3e7b710b59a6ba8106d9aa9ca5e) Thanks [@jameshfisher](https://github.com/jameshfisher)! - Fixed issues where cursor jumps to wrong location

## 0.68.0

### Minor Changes

- [#4620](https://github.com/ianstormtaylor/slate/pull/4620) [`0b59ad54`](https://github.com/ianstormtaylor/slate/commit/0b59ad5414f682b510453696b6f45d5a46cb66bb) Thanks [@NicklasAndersson](https://github.com/NicklasAndersson)! - Support selection in readOnly=true editors.

## 0.67.1

### Patch Changes

- [#4616](https://github.com/ianstormtaylor/slate/pull/4616) [`77d9f60a`](https://github.com/ianstormtaylor/slate/commit/77d9f60ab5e497aadf2d0c9564b1e79525984734) Thanks [@jameshfisher](https://github.com/jameshfisher)! - Fixed crash on self-deleting void node

* [#4617](https://github.com/ianstormtaylor/slate/pull/4617) [`b186d3ea`](https://github.com/ianstormtaylor/slate/commit/b186d3ea12ce59c024a56fcbad4604c919757d36) Thanks [@imdbsd](https://github.com/imdbsd)! - Fix crash on drag and drop image on readOnly editable

- [#4614](https://github.com/ianstormtaylor/slate/pull/4614) [`72160fac`](https://github.com/ianstormtaylor/slate/commit/72160fac08fde98d223c9dd2b4263897d23454f6) Thanks [@echarles](https://github.com/echarles)! - Add insertFragmentData and insertTextData to the ReactEditor API

## 0.67.0

### Minor Changes

- [#4540](https://github.com/ianstormtaylor/slate/pull/4540) [`11ef83b4`](https://github.com/ianstormtaylor/slate/commit/11ef83b47fca84d1f908b5c9eeefada516fe9fed) Thanks [@bryanph](https://github.com/bryanph)! - The Slate Provider's "value" prop is now only used as initial state for editor.children as was intended before. If your code relies on replacing editor.children you should do so by replacing it directly instead of relying on the "value" prop to do this for you.

### Patch Changes

- [#4577](https://github.com/ianstormtaylor/slate/pull/4577) [`4b2e4000`](https://github.com/ianstormtaylor/slate/commit/4b2e4000d6253bd86fab237b6f2c70e9f8d30f09) Thanks [@jameshfisher](https://github.com/jameshfisher)! - Fixed a bug that removed the selection when hovering over a non-selectable DOM element

* [#4605](https://github.com/ianstormtaylor/slate/pull/4605) [`87ab2efa`](https://github.com/ianstormtaylor/slate/commit/87ab2efa41a5b7a1324b3fc97117a1cdd3b41d66) Thanks [@jaked](https://github.com/jaked)! - defer native events within Editable to avoid bugs with Editor

- [#4584](https://github.com/ianstormtaylor/slate/pull/4584) [`f40e515d`](https://github.com/ianstormtaylor/slate/commit/f40e515dc7f956b7fd859688c0170f2c1763fecf) Thanks [@jameshfisher](https://github.com/jameshfisher)! - Fixed bug: setting selection from `contentEditable:false` element causes crash

## 0.66.7

### Patch Changes

- [#4588](https://github.com/ianstormtaylor/slate/pull/4588) [`ae65ae5f`](https://github.com/ianstormtaylor/slate/commit/ae65ae5f717c877eee0e3f839b76fc18d8b44999) Thanks [@jaked](https://github.com/jaked)! - revert #4455 / #4512; fix triple-click by unhanging range with void

## 0.66.6

### Patch Changes

- [#4556](https://github.com/ianstormtaylor/slate/pull/4556) [`b1084918`](https://github.com/ianstormtaylor/slate/commit/b10849182086699d4bb18209a37ea6247f712bd0) Thanks [@jaked](https://github.com/jaked)! - fix forced update in TextString in case of double render

## 0.66.4

### Patch Changes

- [#4304](https://github.com/ianstormtaylor/slate/pull/4304) [`7ba486aa`](https://github.com/ianstormtaylor/slate/commit/7ba486aa397411a3e83ab636b0982167d95319c0) Thanks [@davidruisinger](https://github.com/davidruisinger)! - Fixed a bug where text was typed backwards within nested editor

## 0.66.3

### Patch Changes

- [#4547](https://github.com/ianstormtaylor/slate/pull/4547) [`677da0ca`](https://github.com/ianstormtaylor/slate/commit/677da0ca87ffefb36676200fee5cf5cf0136b22e) Thanks [@clauderic](https://github.com/clauderic)! - Fixed a bug that caused the editor to be unable to resolve a Slate point from a DOM point when selecting an entire document that ended in a new line in Firefox.

* [#4526](https://github.com/ianstormtaylor/slate/pull/4526) [`bc85497d`](https://github.com/ianstormtaylor/slate/commit/bc85497d58dc2eddb0918eed4c7d25d040fa653f) Thanks [@VictorBaron](https://github.com/VictorBaron)! - Fix - delete selected inline void in chrome

- [#4549](https://github.com/ianstormtaylor/slate/pull/4549) [`f9c41a56`](https://github.com/ianstormtaylor/slate/commit/f9c41a569cab2000bd14df5f516c80089b3bf0ac) Thanks [@nemanja-tosic](https://github.com/nemanja-tosic)! - Fix deletion of expanded range (#4546)

## 0.66.2

### Patch Changes

- [#4529](https://github.com/ianstormtaylor/slate/pull/4529) [`bd80a0b8`](https://github.com/ianstormtaylor/slate/commit/bd80a0b8dc108a05addb6e599b7f6272acc8aa57) Thanks [@nemanja-tosic](https://github.com/nemanja-tosic)! - Fix erroneous text after native insert

## 0.66.1

### Patch Changes

- [#4514](https://github.com/ianstormtaylor/slate/pull/4514) [`8b5dbc3d`](https://github.com/ianstormtaylor/slate/commit/8b5dbc3dc7716b51b74a3b7a3dbe2609642f2f6c) Thanks [@dylans](https://github.com/dylans)! - fix(react-editor): reset focus offset when triple clicking

## 0.66.0

### Minor Changes

- [#3888](https://github.com/ianstormtaylor/slate/pull/3888) [`25afbd43`](https://github.com/ianstormtaylor/slate/commit/25afbd43001cdee852af6386d2b701d943b788da) Thanks [@bkrausz](https://github.com/bkrausz)! - Use native character insertion to fix browser/OS text features

### Patch Changes

- [#4475](https://github.com/ianstormtaylor/slate/pull/4475) [`c1433f56`](https://github.com/ianstormtaylor/slate/commit/c1433f56cfe13feb826264989bb4f68a0eefab62) Thanks [@skogsmaskin](https://github.com/skogsmaskin)! - [slate-react]: fix selection bugs when multiple editors share value

* [#4132](https://github.com/ianstormtaylor/slate/pull/4132) [`48b71294`](https://github.com/ianstormtaylor/slate/commit/48b7129447347c9cf7a0535026287896ef59779b) Thanks [@ulion](https://github.com/ulion)! - Make onDomSelectionChange trigger after onClick.

- [#4493](https://github.com/ianstormtaylor/slate/pull/4493) [`3dd74dd5`](https://github.com/ianstormtaylor/slate/commit/3dd74dd58daa907bfa1fb44bc5655ae2fc8ddb35) Thanks [@dylans](https://github.com/dylans)! - Update error message for useSlate

* [#4450](https://github.com/ianstormtaylor/slate/pull/4450) [`220f2d2c`](https://github.com/ianstormtaylor/slate/commit/220f2d2ce6dffcc1a0f2ea1e8725601b8ea1949b) Thanks [@neko-neko](https://github.com/neko-neko)! - Changed so that the onKeyDown event do not fired while IME converting.

- [#4452](https://github.com/ianstormtaylor/slate/pull/4452) [`935b3a79`](https://github.com/ianstormtaylor/slate/commit/935b3a79d6ec7d7e8f20804b2703e984e9c396e0) Thanks [@dylans](https://github.com/dylans)! - double ime fix for qq browser

* [#4500](https://github.com/ianstormtaylor/slate/pull/4500) [`50bb3d7e`](https://github.com/ianstormtaylor/slate/commit/50bb3d7e32d640957018831526235ca656963f1d) Thanks [@tubbo](https://github.com/tubbo)! - Upgrade `is-plain-object` to v5.0.0

- [#4480](https://github.com/ianstormtaylor/slate/pull/4480) [`e51566ad`](https://github.com/ianstormtaylor/slate/commit/e51566ada84cfa107c445cc6f3908e78c18656b6) Thanks [@imdbsd](https://github.com/imdbsd)! - Add key for Children SelectedContext.Provider

* [#4454](https://github.com/ianstormtaylor/slate/pull/4454) [`d06706c9`](https://github.com/ianstormtaylor/slate/commit/d06706c9e15bbbdd7cdd9a1bbb38c87d37c85ea1) Thanks [@imdbsd](https://github.com/imdbsd)! - Fix to read fragment from data-slate-fragment when application/x-slate-fragment is missing

- [#4460](https://github.com/ianstormtaylor/slate/pull/4460) [`ace397f9`](https://github.com/ianstormtaylor/slate/commit/ace397f96602d93ab9216e3d3434f55eef981e4d) Thanks [@dylans](https://github.com/dylans)! - fix double character insertion regression due to unnecessary memo

* [#4451](https://github.com/ianstormtaylor/slate/pull/4451) [`8e4120ae`](https://github.com/ianstormtaylor/slate/commit/8e4120ae315151705152e62944737ca4f62ad446) Thanks [@githoniel](https://github.com/githoniel)! - fix IME double input with editor mark

- [#4503](https://github.com/ianstormtaylor/slate/pull/4503) [`2065c5bd`](https://github.com/ianstormtaylor/slate/commit/2065c5bdfd0de9f7d5ea049b23cd22b71bb80225) Thanks [@bytrangle](https://github.com/bytrangle)! - Fix incorrect selection when triple clicking blocks in Editable component

* [#4433](https://github.com/ianstormtaylor/slate/pull/4433) [`a1f925bd`](https://github.com/ianstormtaylor/slate/commit/a1f925bddfb8e4507977b3449972d4521d05b148) Thanks [@imdbsd](https://github.com/imdbsd)! - Fix copy-paste a slate fragment on android editable

- [#4365](https://github.com/ianstormtaylor/slate/pull/4365) [`906e5af1`](https://github.com/ianstormtaylor/slate/commit/906e5af1b1af07454da0a93490fca70b58fd9986) Thanks [@samarsault](https://github.com/samarsault)! - fix a bug where element selections were not captured by useSelected

* [#4342](https://github.com/ianstormtaylor/slate/pull/4342) [`834ce348`](https://github.com/ianstormtaylor/slate/commit/834ce3483dc407a6293ba29cac8f192c13f57b01) Thanks [@imdbsd](https://github.com/imdbsd)! - Fix editor mark is not inserted on android

## 0.65.3

### Patch Changes

- [#4175](https://github.com/ianstormtaylor/slate/pull/4175) [`bde6e804`](https://github.com/ianstormtaylor/slate/commit/bde6e80476ee0ba7a14c8c7625b51de9e58bb170) Thanks [@gyh9457](https://github.com/gyh9457)! - Fixed a bug in the memoization logic for the leaves of text nodes.

* [#4394](https://github.com/ianstormtaylor/slate/pull/4394) [`01889807`](https://github.com/ianstormtaylor/slate/commit/0188980796b7a4b23ef2ee9e7e468532c1f5c8c4) Thanks [@jaked](https://github.com/jaked)! - fix bug where decorate is not called on immediate children of editor

- [#4049](https://github.com/ianstormtaylor/slate/pull/4049) [`6c844227`](https://github.com/ianstormtaylor/slate/commit/6c8442272105ec78b88d38efecb7aab9bb4e41de) Thanks [@ulion](https://github.com/ulion)! - Fix ios chrome ime double input issue.

* [#4427](https://github.com/ianstormtaylor/slate/pull/4427) [`3f69a9f3`](https://github.com/ianstormtaylor/slate/commit/3f69a9f3951b5beca77b065aaa5eba0737e68a8e) Thanks [@ben10code](https://github.com/ben10code)! - Fix crash when unmounting an editor rendered within a React portal. The issue was arising at unmount time, because `getRootNode` returned the dettached portal node and it is not an instance of `Document` or `ShadowRoot`. As a fix, `getDocumentOrShadowRoot` has been refactored to return a root node instead of throwing. In sum, this patch fixes a regression bug introduced by https://github.com/ianstormtaylor/slate/pull/3749/

- [#4369](https://github.com/ianstormtaylor/slate/pull/4369) [`c217dbb5`](https://github.com/ianstormtaylor/slate/commit/c217dbb5b9190753298bbc117a49af940a3a0d53) Thanks [@thesunny](https://github.com/thesunny)! - Scroll when inserting new text will now scroll parent scrollables

* [#4333](https://github.com/ianstormtaylor/slate/pull/4333) [`e0776c5c`](https://github.com/ianstormtaylor/slate/commit/e0776c5c923f1fb33a130599e558e6dffdde40f4) Thanks [@dylans](https://github.com/dylans)! - Allow setFragmentData to work without copy/paste or DnD data structure

- [#4421](https://github.com/ianstormtaylor/slate/pull/4421) [`237edc6e`](https://github.com/ianstormtaylor/slate/commit/237edc6ea616c9171611e632e146872a245bdb0e) Thanks [@jaked](https://github.com/jaked)! - fix decorate bug (#4277) without adding extra layers of render tree

* [#4347](https://github.com/ianstormtaylor/slate/pull/4347) [`46c8871c`](https://github.com/ianstormtaylor/slate/commit/46c8871c9cafd3017b2c9afff9b36f0527c2205f) Thanks [@aiwenar](https://github.com/aiwenar)! - Re-render leaf when new properties were added to it

- [#4352](https://github.com/ianstormtaylor/slate/pull/4352) [`4b373dc2`](https://github.com/ianstormtaylor/slate/commit/4b373dc29055a6fb3e2cdb26dd4cd023787603a5) Thanks [@hueyhe](https://github.com/hueyhe)! - Do not display placeholder when composing

## 0.65.2

### Patch Changes

- [#4331](https://github.com/ianstormtaylor/slate/pull/4331) [`a3bc97af`](https://github.com/ianstormtaylor/slate/commit/a3bc97af3e3bc88ccf9ab7eadb1a56c0bc92f436) Thanks [@golota60](https://github.com/golota60)! - Fix deletion of selected inline void nodes in Safari when presssing `backspace` or `delete`. This is a bug that [was originally fixed only for Google Chrome](https://github.com/ianstormtaylor/slate/issues/3456), but the fix also needs to be applied in Safari.

## 0.65.1

### Patch Changes

- [#4324](https://github.com/ianstormtaylor/slate/pull/4324) [`61171a23`](https://github.com/ianstormtaylor/slate/commit/61171a23821b882116deabceec15f7e2649d271c) Thanks [@clauderic](https://github.com/clauderic)! - Fix backward typing bug in Safari by ensuring the selection is always removed on blur.
  Safari doesn't always remove the selection, even if the contenteditable element no longer has focus.
  In this scenario, we need to forcefully remove the selection on blur.
  Refer to https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web

## 0.65.0

### Minor Changes

- [#4299](https://github.com/ianstormtaylor/slate/pull/4299) [`2c17e2b7`](https://github.com/ianstormtaylor/slate/commit/2c17e2b7f9dbfa4a821b05668bd00f465da175ad) Thanks [@georgberecz](https://github.com/georgberecz)! - Allow custom event handlers on Editable component to return boolean flag to specify whether the event can be treated as being handled.

  By default, the `Editable` component comes with a set of event handlers that handle typical rich-text editing behaviors (for example, it implements its own `onCopy`, `onPaste`, `onDrop`, and `onKeyDown` handlers).

  In some cases you may want to extend or override Slate's default behavior, which can be done by passing your own event handler(s) to the `Editable` component.

  Your custom event handler can control whether or not Slate should execute its own event handling for a given event after your handler runs depending on the return value of your event handler as described below.

  ```jsx
  import {Editable} from 'slate-react';

  function MyEditor() {
    const onClick = event => {
      // Implement custom event logic...

      // When no value is returned, Slate will execute its own event handler when
      // neither isDefaultPrevented nor isPropagationStopped was set on the event
    };

    const onDrop = event => {
      // Implement custom event logic...

      // No matter the state of the event, treat it as being handled by returning
      // true here, Slate will skip its own event handler
      return true;
    };

    const onDragStart = event => {
      // Implement custom event logic...

      // No matter the status of the event, treat event as *not* being handled by
      // returning false, Slate will exectue its own event handler afterward
      return false;
    };

    return (
      <Editable
        onClick={onClick}
        onDrop={onDrop}
        onDragStart={onDragStart}
        {/*...*/}
      />
    )
  }
  ```

### Patch Changes

- [#4266](https://github.com/ianstormtaylor/slate/pull/4266) [`411e5a19`](https://github.com/ianstormtaylor/slate/commit/411e5a193bd639fb743c2253a5f5e43a5949b100) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Removed accidental bundling of `slate-history` inside `slate-react`

* [#4307](https://github.com/ianstormtaylor/slate/pull/4307) [`a7e3a181`](https://github.com/ianstormtaylor/slate/commit/a7e3a18187d1c29744d78875542abd035220ebdc) Thanks [@clauderic](https://github.com/clauderic)! - Fix deletion of selected inline void nodes in Chrome. Chrome does not fire a `beforeinput` event when deleting backwards within an inline void node, so we need to add special logic to handle this edge-case for Chrome only.

- [#4272](https://github.com/ianstormtaylor/slate/pull/4272) [`294d5120`](https://github.com/ianstormtaylor/slate/commit/294d5120aed89f4e1c7a818e0d1339f4fa1cbaf5) Thanks [@clauderic](https://github.com/clauderic)! - Fix errors accessing `globalThis` in browsers that do not implement it

* [#4295](https://github.com/ianstormtaylor/slate/pull/4295) [`dfc03960`](https://github.com/ianstormtaylor/slate/commit/dfc039601f7b4d74592dfe39c31b67c0f0619bca) Thanks [@dubzzz](https://github.com/dubzzz)! - Fix React warnings related to `autoCorrect` and `autoCapitalize` attributes being passed as a boolean instead of a string.

- [#4271](https://github.com/ianstormtaylor/slate/pull/4271) [`ff267767`](https://github.com/ianstormtaylor/slate/commit/ff267767f61577fdbd68119a1c978e9856e3bb31) Thanks [@omerg](https://github.com/omerg)! - Fixed typo: Renamed `toSlatePoint` argument `extractMatch` to `exactMatch`

## 0.64.0

### Minor Changes

- [#4257](https://github.com/ianstormtaylor/slate/pull/4257) [`4f0d1120`](https://github.com/ianstormtaylor/slate/commit/4f0d1120d46d1024d94e3c2742026f6c54357e1f) Thanks [@clauderic](https://github.com/clauderic)! - Added support for Android devices using a `MutationObserver` based reconciliation layer.

  Bugs should be expected; translating mutations into a set of operations that need to be reconciled onto the Slate model is not an absolute science, and requires a lot of guesswork and handling of edge cases. There are still edge cases that aren't being handled.

  This reconciliation layer aims to support Android 10 and 11. Earlier versions of Android work to a certain extent, but have more bugs and edge cases that currently aren't well supported.

## 0.63.0

### Patch Changes

- [#4238](https://github.com/ianstormtaylor/slate/pull/4238) [`c14e1fbc`](https://github.com/ianstormtaylor/slate/commit/c14e1fbc77c51f7928ba8ab089c76f3e3438fb97) Thanks [@clauderic](https://github.com/clauderic)! - Fix duplicated content and other bugs related to drag and drop handling

* [#4237](https://github.com/ianstormtaylor/slate/pull/4237) [`623960a7`](https://github.com/ianstormtaylor/slate/commit/623960a7d14103b8cebe667019b4de5f8ad1fd61) Thanks [@dylans](https://github.com/dylans)! - Fixed text insertion logic to prevent crashing in newer Firefox versions.

## 0.62.1

### Patch Changes

- [#4118](https://github.com/ianstormtaylor/slate/pull/4118) [`6a137633`](https://github.com/ianstormtaylor/slate/commit/6a1376332bbd2567336c444c57c1e64fdf706feb) Thanks [@kamilkazmierczak](https://github.com/kamilkazmierczak)! - Improved detection of legacy browsers that don't have proper `beforeinput` support.

* [#4190](https://github.com/ianstormtaylor/slate/pull/4190) [`ea2eefef`](https://github.com/ianstormtaylor/slate/commit/ea2eefefb84365eb969e91151afc861e0dbefefd) Thanks [@juliankrispel](https://github.com/juliankrispel)! - Added a `renderPlaceholder` prop to the `<Editable>` component for customizing how placeholders are rendered.

- [#4157](https://github.com/ianstormtaylor/slate/pull/4157) [`de5cc7e5`](https://github.com/ianstormtaylor/slate/commit/de5cc7e5ed97fdca9e3766a8d947ab6391e6ccb2) Thanks [@githoniel](https://github.com/githoniel)! - Fixed a bug when syncing the selection for IME-based editing.

* [#4158](https://github.com/ianstormtaylor/slate/pull/4158) [`ea6dc089`](https://github.com/ianstormtaylor/slate/commit/ea6dc08913d9dd671eeb05796dca522a4a35904e) Thanks [@githoniel](https://github.com/githoniel)! - Fixed a bug that resulted in doubly-input characters when using an IME.

- [#4211](https://github.com/ianstormtaylor/slate/pull/4211) [`1c32b97d`](https://github.com/ianstormtaylor/slate/commit/1c32b97d23138d301e9ecb567263e3001cc4dbfa) Thanks [@clauderic](https://github.com/clauderic)! - Collapse expanded selection before handling `moveWordBackward` (`alt + left`) and `moveWordForward` (`alt + right`) hotkeys.

* [#4219](https://github.com/ianstormtaylor/slate/pull/4219) [`737aaa9c`](https://github.com/ianstormtaylor/slate/commit/737aaa9cde2d4a2d6d64b83256aa5d9d1b5ce720) Thanks [@juliankrispel](https://github.com/juliankrispel)! - Fixes error that occurs when Editor is rendered inside iframe

## 0.62.0

### Minor Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - **Add directional awareness to `Editor.deleteFragment`.** This is an obscure change, but is a required distinction when implementing features that need to "fake delete" content (like Google Docs's suggestions). Previously deleting always collapsed to the end of a range, but now it can collapse forwards as well.

* [#4154](https://github.com/ianstormtaylor/slate/pull/4154) [`7283c51f`](https://github.com/ianstormtaylor/slate/commit/7283c51feb83cb8522bc16efce09bb01c29400b9) Thanks [@ianstormtaylor](https://github.com/ianstormtaylor)! - **Start using [🦋 Changesets](https://github.com/atlassian/changesets) to manage releases.** Going forward, whenever a pull request is made that fixes or adds functionality to Slate, it will need to be accompanied by a changset Markdown file describing the change. These files will be automatically used in the release process when bump the versions of Slate and compiling the changelog.

### Patch Changes

- [#4150](https://github.com/ianstormtaylor/slate/pull/4150) [`bbd7d9c3`](https://github.com/ianstormtaylor/slate/commit/bbd7d9c33023add223ef9f1a33b657a468552caf) Thanks [@nivekithan](https://github.com/nivekithan)! - Added support for using the new `beforeInput` events in the latest Firefox.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed spellcheck disabling logic to always work in older versions of Firefox.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed browser-detection behavior to work with Deno.

* [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Updated placeholder styles to allow for wrapping long placeholder text.

- [#3698](https://github.com/ianstormtaylor/slate/pull/3698) [`bf83f333`](https://github.com/ianstormtaylor/slate/commit/bf83f333e689bc17b96504b497bb7fcdf6dc7fc1) Thanks [@pubuzhixing8](https://github.com/pubuzhixing8)! - Fixed selection updating with IME inputs in browsers that support `beforeinput`.

* [#3652](https://github.com/ianstormtaylor/slate/pull/3652) [`f3fb40cc`](https://github.com/ianstormtaylor/slate/commit/f3fb40cce044b73b6da13013f90bd7018f2f5d8a) Thanks [@Andarist](https://github.com/Andarist)! - Fixed selection logic when a controlled editor's nodes change out from under it.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug where memoization logic would prevent placeholders from re-rendering properly.

* [#3326](https://github.com/ianstormtaylor/slate/pull/3326) [`d5b2d7f5`](https://github.com/ianstormtaylor/slate/commit/d5b2d7f55e2982019b246fdea1e9eb845d0e2fc2) Thanks [@rockettomatooo](https://github.com/rockettomatooo)! - Added invariants when passing invalud `value` or `editor` props to `<Editable>`.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed cursor movement in RTL text.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug in the conversion of DOM points to Slate points.

- [#3746](https://github.com/ianstormtaylor/slate/pull/3746) [`f8be509e`](https://github.com/ianstormtaylor/slate/commit/f8be509e4d0b5c13bb791e0fd5702242319d114f) Thanks [@gztomas](https://github.com/gztomas)! - Fixed auto-scrolling behavior when a block is bigger than the viewport.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug that occurred when using Babel's `loose` mode.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed deleting void elements when using cut-and-paste.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug that crashed the editor when using IME input.

- [#3396](https://github.com/ianstormtaylor/slate/pull/3396) [`469e6b26`](https://github.com/ianstormtaylor/slate/commit/469e6b26f50857ef0d68cdf5a54793f8fe9033fd) Thanks [@cvlmtg](https://github.com/cvlmtg)! - Fixed allowing the `onPaste` handler to be overridden in all browsers.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed internal decoration logic to be faster and require fewer re-renders.

- [#3894](https://github.com/ianstormtaylor/slate/pull/3894) [`7fe41f15`](https://github.com/ianstormtaylor/slate/commit/7fe41f156614453479cb9ea649fe5665b616d3a7) Thanks [@msc117](https://github.com/msc117)! - Fixed an error that happened when selecting void nodes in a read-only editor.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed `move_node` operations to not always require a full re-render.

- [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Fixed normalization of DOM points to be more accurate when triple-clicking.

* [`d5589279`](https://github.com/ianstormtaylor/slate/commit/d5589279e8792185c1082af720a73f55b16797dd) - Fixed a bug that prevented `isFocused` from updating on certain focus changes.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed IME input to not insert repeated characters.

* [#3749](https://github.com/ianstormtaylor/slate/pull/3749) [`0473d0bf`](https://github.com/ianstormtaylor/slate/commit/0473d0bf93808b0e4e98abe833b7f7f4f5aff3b1) Thanks [@davidruisinger](https://github.com/davidruisinger)! - Fixes Slate to work with the Shadow DOM.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed deleting by line to account for the line breaks in the browser.
