// Plugin
export { DOMEditor, type DOMEditorInterface } from './plugin/dom-editor'
export { withDOM } from './plugin/with-dom'

// Utils
export { TRIPLE_CLICK } from './utils/constants'

export {
  applyStringDiff,
  mergeStringDiffs,
  normalizePoint,
  normalizeRange,
  normalizeStringDiff,
  StringDiff,
  targetRange,
  TextDiff,
  verifyDiffState,
} from './utils/diff-text'

export {
  DOMElement,
  DOMNode,
  DOMPoint,
  DOMRange,
  DOMSelection,
  DOMStaticRange,
  DOMText,
  getActiveElement,
  getDefaultView,
  getSelection,
  hasShadowRoot,
  isAfter,
  isBefore,
  isDOMElement,
  isDOMNode,
  isDOMSelection,
  isPlainTextOnlyPaste,
  isTrackedMutation,
  normalizeDOMPoint,
} from './utils/dom'

export {
  CAN_USE_DOM,
  HAS_BEFORE_INPUT_SUPPORT,
  IS_ANDROID,
  IS_CHROME,
  IS_FIREFOX,
  IS_FIREFOX_LEGACY,
  IS_IOS,
  IS_WEBKIT,
  IS_UC_MOBILE,
  IS_WECHATBROWSER,
} from './utils/environment'

export { default as Hotkeys } from './utils/hotkeys'

export { Key } from './utils/key'

export {
  isElementDecorationsEqual,
  isTextDecorationsEqual,
  splitDecorationsByChild,
} from './utils/range-list'

export {
  EDITOR_TO_ELEMENT,
  EDITOR_TO_FORCE_RENDER,
  EDITOR_TO_KEY_TO_ELEMENT,
  EDITOR_TO_ON_CHANGE,
  EDITOR_TO_PENDING_ACTION,
  EDITOR_TO_PENDING_DIFFS,
  EDITOR_TO_PENDING_INSERTION_MARKS,
  EDITOR_TO_PENDING_SELECTION,
  EDITOR_TO_PLACEHOLDER_ELEMENT,
  EDITOR_TO_SCHEDULE_FLUSH,
  EDITOR_TO_USER_MARKS,
  EDITOR_TO_USER_SELECTION,
  EDITOR_TO_WINDOW,
  ELEMENT_TO_NODE,
  IS_COMPOSING,
  IS_FOCUSED,
  IS_NODE_MAP_DIRTY,
  IS_READ_ONLY,
  MARK_PLACEHOLDER_SYMBOL,
  NODE_TO_ELEMENT,
  NODE_TO_INDEX,
  NODE_TO_KEY,
  NODE_TO_PARENT,
  PLACEHOLDER_SYMBOL,
} from './utils/weak-maps'
