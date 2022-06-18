# slate

## 0.81.1

### Patch Changes

- [#5015](https://github.com/ianstormtaylor/slate/pull/5015) [`9ae37287`](https://github.com/ianstormtaylor/slate/commit/9ae372875df1ee3ef6041f5d6bd2f57ee8291ea0) Thanks [@tithanayut](https://github.com/tithanayut)! - Fix deleteBackward behavior for Thai script where deleting N character(s) backward should delete
  N code point(s) instead of an entire grapheme cluster

## 0.81.0

### Minor Changes

- [#4999](https://github.com/ianstormtaylor/slate/pull/4999) [`fe13a8f9`](https://github.com/ianstormtaylor/slate/commit/fe13a8f9e750569342ee004951e34233ab6614bf) Thanks [@alexandercampbell](https://github.com/alexandercampbell)! - Add new Slate.Scrubber interface to allow scrubbing end user data from exception
  text. The default behavior remains unchanged.

## 0.80.0

### Minor Changes

- [#4892](https://github.com/ianstormtaylor/slate/pull/4892) [`d2fc25c3`](https://github.com/ianstormtaylor/slate/commit/d2fc25c3c31453597f59cd2ac6ba087a1beb1fe3) Thanks [@suilang](https://github.com/suilang)! - update insertText logic when selection is not collapsed

### Patch Changes

- [#5008](https://github.com/ianstormtaylor/slate/pull/5008) [`e9ea2815`](https://github.com/ianstormtaylor/slate/commit/e9ea2815950fc6b78fb0a2ba0e5d95c8553ac023) Thanks [@steve-codaio](https://github.com/steve-codaio)! - Revert to previous position behavior around inline voids

## 0.78.0

### Minor Changes

- [#4974](https://github.com/ianstormtaylor/slate/pull/4974) [`3b7a1bf7`](https://github.com/ianstormtaylor/slate/commit/3b7a1bf72d0c3951416c771f7f149bfbda411111) Thanks [@dylans](https://github.com/dylans)! - Added types for options and common string literals, thanks @JoshuaKGoldberg

## 0.77.2

### Patch Changes

- [#4952](https://github.com/ianstormtaylor/slate/pull/4952) [`9ce0a08c`](https://github.com/ianstormtaylor/slate/commit/9ce0a08c2a8b2b72df14141a06ca08825a66d472) Thanks [@steve-codaio](https://github.com/steve-codaio)! - Fix positions iteration when starting inside an inline void node

## 0.77.0

### Patch Changes

- [#4939](https://github.com/ianstormtaylor/slate/pull/4939) [`c39c8082`](https://github.com/ianstormtaylor/slate/commit/c39c8082a97dec8fc9ba64568d817ba87e348b48) Thanks [@ahoisl](https://github.com/ahoisl)! - Fix pointRef leaks caused by not unref'ing

## 0.76.1

### Patch Changes

- [#4914](https://github.com/ianstormtaylor/slate/pull/4914) [`aff67312`](https://github.com/ianstormtaylor/slate/commit/aff67312cbfa7e45df5cf6abcaec9f4f7d5f1a89) Thanks [@sennpang](https://github.com/sennpang)! - Fixed Triple click selection and copy&paste in read-only mode

## 0.76.0

### Minor Changes

- [#4873](https://github.com/ianstormtaylor/slate/pull/4873) [`20acca4b`](https://github.com/ianstormtaylor/slate/commit/20acca4bc8f31bd1aa6fbca2c49aaae5f31cadfe) Thanks [@bryanph](https://github.com/bryanph)! - A different behavior for inserting a soft break with shift+enter is quite common in rich text editors. Right now you have to do this in onKeyDown which is not so nice. This adds a separate insertSoftBreak method on the editor instance that gets called when a soft break is inserted. This maintains the current default behavior for backwards compatibility (it just splits the block). But at least you can easily overwrite it now.

  If you rely on overwriting editor.insertBreak for extra behavior for soft breaks this might be a breaking change for you and you should overwrite editor.insertSoftBreak instead.

### Patch Changes

- [#4912](https://github.com/ianstormtaylor/slate/pull/4912) [`43ca2b56`](https://github.com/ianstormtaylor/slate/commit/43ca2b56c8bd8bcc30dd38808dd191f804d53ae4) Thanks [@zhugexinxin](https://github.com/zhugexinxin)! - feat: add merge to setNodes and test

## 0.75.0

### Patch Changes

- [#4889](https://github.com/ianstormtaylor/slate/pull/4889) [`970523f`](https://github.com/ianstormtaylor/slate/commit/970523f881bf1918f91cb9de87c961dfb965e8a1)(https://github.com/ianstormtaylor/slate/commit/970523f881bf1918f91cb9de87c961dfb965e8a1) Thanks [@zhugexinxin](https://github.com/zhugexinxin)! - feat: add custom compare node props

## 0.73.1

### Patch Changes

- [#4858](https://github.com/ianstormtaylor/slate/pull/4858) [`33be22f3`](https://github.com/ianstormtaylor/slate/commit/33be22f3e3a0321ded199b13c0d97ae577c6b941) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Reverted #4804 as it triggered an exception when inserting text with multi-block selection

## 0.73.0

### Minor Changes

- [#4848](https://github.com/ianstormtaylor/slate/pull/4848) [`482b090e`](https://github.com/ianstormtaylor/slate/commit/482b090e6f6f4c5fbc85e6dd2ea65387156ae8b5) Thanks [@rockettomatooo](https://github.com/rockettomatooo)! - fix point transform for insert_text operations to account for affinity

## 0.72.8

### Patch Changes

- [#4804](https://github.com/ianstormtaylor/slate/pull/4804) [`03861afc`](https://github.com/ianstormtaylor/slate/commit/03861afc62c3b27339d20151ca8a3e52f51ff973) Thanks [@suilang](https://github.com/suilang)! - update insertText logic when selection is not collapsed

## 0.72.3

### Patch Changes

- [#4703](https://github.com/ianstormtaylor/slate/pull/4703) [`205d4b7e`](https://github.com/ianstormtaylor/slate/commit/205d4b7e66b30ec911e8968a736593aaf2be1567) Thanks [@e1himself](https://github.com/e1himself)! - Add tests for Editor.unhangRange() behavior

## 0.72.2

### Patch Changes

- [#4729](https://github.com/ianstormtaylor/slate/pull/4729) [`ab62da20`](https://github.com/ianstormtaylor/slate/commit/ab62da2064921f534ce158f20cd853d2d904f6f6) Thanks [@ahoisl](https://github.com/ahoisl)! - chore: add vscode launch.json debug config

* [#4735](https://github.com/ianstormtaylor/slate/pull/4735) [`e5427ddd`](https://github.com/ianstormtaylor/slate/commit/e5427dddfc57b4362b7545e9971cdfb9b05d5c3d) Thanks [@steve-codaio](https://github.com/steve-codaio)! - Optimize path transforms during normalization

## 0.72.0

### Patch Changes

- [#4708](https://github.com/ianstormtaylor/slate/pull/4708) [`2fc7ad92`](https://github.com/ianstormtaylor/slate/commit/2fc7ad924cfbb75de59f685eeabb0375769201b9) Thanks [@bryanph](https://github.com/bryanph)! - Allow `Operation` type to be extended

  For example:

  ```
  import type { BaseOperation } from 'slate'

  type CustomOperation =
   | BaseOperation
   | YourCustomOperation
   | AnotherCustomOperation

  declare module 'slate' {
    interface CustomTypes {
      Operation: CustomOperation;
    }
  }
  ```

## 0.71.0

### Minor Changes

- [#4672](https://github.com/ianstormtaylor/slate/pull/4672) [`2523dc4f`](https://github.com/ianstormtaylor/slate/commit/2523dc4f6e7fee81baf77a67da4c3adaab921f15) Thanks [@VictorBaron](https://github.com/VictorBaron)! - Fix - deep-equals was always returning true when array props were equals.

### Patch Changes

- [#4671](https://github.com/ianstormtaylor/slate/pull/4671) [`e3afda94`](https://github.com/ianstormtaylor/slate/commit/e3afda946685795237f748e76c7bb051c09cb7fa) Thanks [@unageek](https://github.com/unageek)! - Fixed the issue where the cursor jumps more than one character unexpectedly

## 0.70.0

### Minor Changes

- [#4565](https://github.com/ianstormtaylor/slate/pull/4565) [`5818aca5`](https://github.com/ianstormtaylor/slate/commit/5818aca5038f38465a5769fe944f184be0255341) Thanks [@oliger](https://github.com/oliger)! - Fix issue with unicode 1.1 smileys followed by a variation selector.

### Patch Changes

- [#4638](https://github.com/ianstormtaylor/slate/pull/4638) [`e0f41514`](https://github.com/ianstormtaylor/slate/commit/e0f41514a1e0e866297904be16eff82702e8afd8) Thanks [@e1himself](https://github.com/e1himself)! - Improve typescript type of `props` argument of `Transforms.setNodes()`

## 0.67.1

### Patch Changes

- [#4578](https://github.com/ianstormtaylor/slate/pull/4578) [`67badb7d`](https://github.com/ianstormtaylor/slate/commit/67badb7dd03c6d36d31b90689247553c0386d771) Thanks [@jameshfisher](https://github.com/jameshfisher)! - Allow typing at the end of inline elements

## 0.66.5

### Patch Changes

- [#4552](https://github.com/ianstormtaylor/slate/pull/4552) [`37d60c58`](https://github.com/ianstormtaylor/slate/commit/37d60c58b8d4fb844f31888b518be6c2a01fb110) Thanks [@clauderic](https://github.com/clauderic)! - Only apply Firefox `toSlatePoint()` offset fix when the cloned contents end in `\n\n` instead of just `\n`.

## 0.66.2

### Patch Changes

- [#4523](https://github.com/ianstormtaylor/slate/pull/4523) [`0da12c17`](https://github.com/ianstormtaylor/slate/commit/0da12c17dc0484f065af2a270d352593a65c1577) Thanks [@steve-codaio](https://github.com/steve-codaio)! - Fix setNodes when called with 'split' and a collapsed range

## 0.66.1

### Patch Changes

- [#4518](https://github.com/ianstormtaylor/slate/pull/4518) [`6ec399d4`](https://github.com/ianstormtaylor/slate/commit/6ec399d4db60f1a8d59268c333b43a26dc518b79) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fixed flaw in deep-equal algorithm when dealing with nested mark objects

* [#4511](https://github.com/ianstormtaylor/slate/pull/4511) [`2af6868d`](https://github.com/ianstormtaylor/slate/commit/2af6868d41b8d797eebdcba5edb18638fe62fd45) Thanks [@dylans](https://github.com/dylans)! - update release process for yarn 3

- [#4516](https://github.com/ianstormtaylor/slate/pull/4516) [`59ca7a8f`](https://github.com/ianstormtaylor/slate/commit/59ca7a8f518c7735c89148ff1d9a8ae9dcf4297f) Thanks [@dylans](https://github.com/dylans)! - another attempt to get the automated changeset workflow working again

## 0.66.0

### Minor Changes

- [#4489](https://github.com/ianstormtaylor/slate/pull/4489) [`1b560de3`](https://github.com/ianstormtaylor/slate/commit/1b560de3e13d08cdc95d7f659a497ff0f07d296a) Thanks [@nemanja-tosic](https://github.com/nemanja-tosic)! - Fix paste to empty node losing structure of first block

* [#4326](https://github.com/ianstormtaylor/slate/pull/4326) [`00259003`](https://github.com/ianstormtaylor/slate/commit/0025900349b2c2ff92c044b97389969fa32a9200) Thanks [@oliger](https://github.com/oliger)! - Add support for [flag](https://emojipedia.org/emoji-flag-sequence/), [keycap](https://emojipedia.org/emoji-keycap-sequence/) and [tag](https://emojipedia.org/emoji-tag-sequence/) unicode sequences.

- [#4276](https://github.com/ianstormtaylor/slate/pull/4276) [`6f47cbbe`](https://github.com/ianstormtaylor/slate/commit/6f47cbbe0d8f320be8baf02a6e26d756d226cfca) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Switched from `fast-deep-equal` to a custom deep equality check. This restores the ability for text nodes with mark values set to `undefined` to merge with text nodes missing those keys.

* [#4431](https://github.com/ianstormtaylor/slate/pull/4431) [`55ff8f00`](https://github.com/ianstormtaylor/slate/commit/55ff8f00e46e5fd0f2aef41da321c02b6d3a0f70) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fixed regression in #4208 where normalization on empty block nodes could not be overridden

- [#3820](https://github.com/ianstormtaylor/slate/pull/3820) [`c6203a2d`](https://github.com/ianstormtaylor/slate/commit/c6203a2d682325e550d4f4b9fc3ee3ca3429e466) Thanks [@githoniel](https://github.com/githoniel)! - unwrapNode call liftNode in reverse order to keep nested block

* [#4428](https://github.com/ianstormtaylor/slate/pull/4428) [`b47d3fd1`](https://github.com/ianstormtaylor/slate/commit/b47d3fd191c6b76585898ec9b8c490f15dcff2da) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Don't set `null` in `set_node`'s `newProperties` object when using `Transforms.unsetNodes()`

### Patch Changes

- [#4132](https://github.com/ianstormtaylor/slate/pull/4132) [`48b71294`](https://github.com/ianstormtaylor/slate/commit/48b7129447347c9cf7a0535026287896ef59779b) Thanks [@ulion](https://github.com/ulion)! - Make onDomSelectionChange trigger after onClick.

* [#4500](https://github.com/ianstormtaylor/slate/pull/4500) [`50bb3d7e`](https://github.com/ianstormtaylor/slate/commit/50bb3d7e32d640957018831526235ca656963f1d) Thanks [@tubbo](https://github.com/tubbo)! - Upgrade `is-plain-object` to v5.0.0

- [#4482](https://github.com/ianstormtaylor/slate/pull/4482) [`dd752df1`](https://github.com/ianstormtaylor/slate/commit/dd752df11dc90da6bd6add88d1cfa6f00f03912b) Thanks [@Jokcy](https://github.com/Jokcy)! - Fix cursor not correct issue after insert multiple nodes with `Transform.insertNodes`

* [#4296](https://github.com/ianstormtaylor/slate/pull/4296) [`479a7591`](https://github.com/ianstormtaylor/slate/commit/479a759108bc0f903715e08d542307566b077227) Thanks [@kellyjosephprice](https://github.com/kellyjosephprice)! - Fix mergeNodes moving node into parent sibling

- [#4458](https://github.com/ianstormtaylor/slate/pull/4458) [`95c759a1`](https://github.com/ianstormtaylor/slate/commit/95c759a19c1e057bbc99148867298a73b014831d) Thanks [@taj-codaio](https://github.com/taj-codaio)! - Normalization now removes empty text nodes after nonempty nodes with differing styles, but before inline nodes.

* [#4505](https://github.com/ianstormtaylor/slate/pull/4505) [`269e59c9`](https://github.com/ianstormtaylor/slate/commit/269e59c93aea31cdb438e9cc07d34cec0e482798) Thanks [@dylans](https://github.com/dylans)! - Immer 9 security update, refactor to support immer 9 API changes

## 0.65.3

### Patch Changes

- [#4253](https://github.com/ianstormtaylor/slate/pull/4253) [`0214b630`](https://github.com/ianstormtaylor/slate/commit/0214b630778e7fa3b6ebcdf6cd9a8e4cf7351bd3) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fix `Transforms.wrapNodes` crashing when the `match` function matched only the editor

* [#4049](https://github.com/ianstormtaylor/slate/pull/4049) [`6c844227`](https://github.com/ianstormtaylor/slate/commit/6c8442272105ec78b88d38efecb7aab9bb4e41de) Thanks [@ulion](https://github.com/ulion)! - Fix ios chrome ime double input issue.

- [#4421](https://github.com/ianstormtaylor/slate/pull/4421) [`237edc6e`](https://github.com/ianstormtaylor/slate/commit/237edc6ea616c9171611e632e146872a245bdb0e) Thanks [@jaked](https://github.com/jaked)! - fix decorate bug (#4277) without adding extra layers of render tree

* [#4349](https://github.com/ianstormtaylor/slate/pull/4349) [`236754c4`](https://github.com/ianstormtaylor/slate/commit/236754c4d2811d50f8e116cfd5de8d7619553cd9) Thanks [@imdbsd](https://github.com/imdbsd)! - Add isElementType utility to Element interface

## 0.63.0

### Minor Changes

- [#4230](https://github.com/ianstormtaylor/slate/pull/4230) [`796389c7`](https://github.com/ianstormtaylor/slate/commit/796389c7d3d9cead1493abcba6c678cb9dfa979f) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Applying invalid `insert_node` operations will now throw an exception for all invalid paths, not just invalid parent paths.

### Patch Changes

- [#4245](https://github.com/ianstormtaylor/slate/pull/4245) [`b33a531b`](https://github.com/ianstormtaylor/slate/commit/b33a531bd0395ecb23bd9fd1ac1cd1c3b31f92ca) Thanks [@JonasKruckenberg](https://github.com/JonasKruckenberg)! - Removed lodash dependecy to reduce bundled footprint

* [#4208](https://github.com/ianstormtaylor/slate/pull/4208) [`feb293aa`](https://github.com/ianstormtaylor/slate/commit/feb293aaa2c02fe3ad319bd021e66908ee770a6e) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fix `Error: Cannot get the start point in the node at path [...] because it has no start text node` caused by normalizing a document where some elements have no children

- [#4230](https://github.com/ianstormtaylor/slate/pull/4230) [`796389c7`](https://github.com/ianstormtaylor/slate/commit/796389c7d3d9cead1493abcba6c678cb9dfa979f) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Exceptions in `editor.apply()` and `Editor.withoutNormalizing()` will no longer leave the editor in an invalid state

* [#4227](https://github.com/ianstormtaylor/slate/pull/4227) [`e6413d46`](https://github.com/ianstormtaylor/slate/commit/e6413d46256f6fc60549974242d3ff6ba61e2968) Thanks [@ulion](https://github.com/ulion)! - Fixed a bug that would allow multiple changes to be scheduled at the same time.

## 0.62.1

### Patch Changes

- [#4193](https://github.com/ianstormtaylor/slate/pull/4193) [`fd70dc0b`](https://github.com/ianstormtaylor/slate/commit/fd70dc0b2c0d06edb9490874fb831161b9759cba) Thanks [@beorn](https://github.com/beorn)! - Fixed insert and remove text operations to no-op without any text.

* [#4078](https://github.com/ianstormtaylor/slate/pull/4078) [`2dad21d1`](https://github.com/ianstormtaylor/slate/commit/2dad21d1d75750e7148b10bdea3ce921a79cbf33) Thanks [@TheSpyder](https://github.com/TheSpyder)! - Fixed inversion of `set_node` operations that delete properties on nodes.

- [#4168](https://github.com/ianstormtaylor/slate/pull/4168) [`95f402c5`](https://github.com/ianstormtaylor/slate/commit/95f402c59414331b2eeca9a19bd2c73c0ab6cd6c) Thanks [@ridhambhat](https://github.com/ridhambhat)! - Fixed a bug in splitting and applying overlapping marks to text nodes.

## 0.62.0

### Minor Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - **Updated `Text.equals` to deeply compare text node properties.** Previously it only did a shallow comparison, but this made it harder to keep track of more complex data structures at the text level.

* [#4154](https://github.com/ianstormtaylor/slate/pull/4154) [`7283c51f`](https://github.com/ianstormtaylor/slate/commit/7283c51feb83cb8522bc16efce09bb01c29400b9) Thanks [@ianstormtaylor](https://github.com/ianstormtaylor)! - **Start using [🦋 Changesets](https://github.com/atlassian/changesets) to manage releases.** Going forward, whenever a pull request is made that fixes or adds functionality to Slate, it will need to be accompanied by a changset Markdown file describing the change. These files will be automatically used in the release process when bump the versions of Slate and compiling the changelog.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - **Added support for custom selection properties.** Previously you could set custom properties on the selection objects but it was not a fully supported feature because there was no way to delete them later. Now custom properties are officially supported and deleting them once set is possible.

### Patch Changes

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed `move_node` operations to normalize the node in question.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Added memoization logic to `Node.isNodeList` and `Editor.isEditor` to speed up common code paths.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug when merging deeply nested multi-child nodes.

* [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug when deleting a hanging range with a trailing void block node.

- [`c6002024`](https://github.com/ianstormtaylor/slate/commit/c60020244b9d25094edb0ffcca8b49dead9b31dc) - Fixed a bug in `Editor.positions` which caused it to sometimes skip positions in text nodes that were segmented across inlines or marks.
