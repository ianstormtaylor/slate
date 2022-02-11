# slate-react

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
