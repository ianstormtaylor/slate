
import { Editor, Raw, Plain, Selection } from '../..'
import Portal from 'react-portal'
import React from 'react'
import initialState from './state.json'
import { requestSpellCheck } from './spell-check'
import { debounce, negate } from 'lodash';

const SPELL_CHECK_WAIT_TIME_MS = 3000;
const SPELL_CHECK_MAX_WAIT_TIME_MS = 30000;

const ignoreSuggestion = ({ rule: { issueType } }) => issueType === 'typographical';

const typeIs = (query) => ({ type }) => type === query;
const typeIsOffset = typeIs('offset');
const typeIsSpelling = typeIs('spelling');

const addX = (x) => (y) => x + y;
const add1 = addX(1);
const sub1 = addX(-1);

const matchesErrorMark = (op, m1) => (m2) => {
  const p1 = m1.data.get('position');
  const p2 = m2.data.get('position');
  const c1 = m1.data.get('message');
  const c2 = m2.data.get('message');
  return c1 === c2 && op(p1) === p2;
};

const isSameError = (chars, position, mark, op) => {
  const character = chars.get(position);
  if (!character) {
    return false3
  }
  return character.marks.some(matchesErrorMark(op, mark));
};

const ignoredError = (chars, offset, length, suggestion) => {
  const character = chars.get(offset);
  return character.marks.filter(typeIsSpelling).reduce((memo, mark) => {
    return memo || (
      mark.data.get('message') === suggestion.message &&
      mark.data.get('ignored')
    );
  }, false);
};

const removeSpellingSuggestion = (transform, key, chars, offset, position, length, mark) => {
  const base = offset - position;

  for (let i = 0; i < length; i++) {
    const character = chars.get(base + i);
    if (character) {
      const remove = character.marks.filter(matchesErrorMark(addX(i - position), mark)).first();
      if (remove) {
        transform.removeMarkByKey(key, base + i, 1, remove);
      }
    }
  }
};

const unchanged = (characters, offset, length) => {
  for (let i = 1; i < length; i++) {
    const character = characters.get(offset + i);
    if (!character) {
      return false;
    }
    const mark = character.marks.filter(typeIsOffset).first();
    if (!mark || (mark.data.get('offset') !== offset + i)) {
      return false;
    }
  }
  return true;
};

const addSpellingSuggestion = (key, suggestion, chars, currOffset, transform) => {
  const length = Math.min(suggestion.length, chars.size - currOffset);

  for (let i = 0; i < length; i++) {
    const mark = {
      type: 'spelling',
      data: {
        length,
        position: i,
        message: suggestion.message,
        shortMessage: suggestion.shortMessage,
        replacements: suggestion.replacements,
        ignored: false,
      },
    };
    transform.addMarkByKey(key, currOffset + i, 1, mark);
  }
};

const removeUnignoredSpellingMarks = (transform, key, offset, character) => {
  character.marks.filter(typeIsSpelling).forEach((mark) => {
    if (!mark.data.get('ignored')) {
      transform.removeMarkByKey(key, offset, 1, mark);
    }
  });
};

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  marks: {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    underlined: props => <u>{props.children}</u>,
    spelling: props => props.mark.data.get('ignored') ? <span>{props.children}</span> : <span className="spelling-error">{props.children}</span>,
  }
}

/**
 * The hovering menu example.
 *
 * @type {Component}
 */

class HoveringMenu extends React.Component {

  _request = null;

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    menu: null,
    spellChecker: null,
    suggestionOnDisplay: null,
    state: Raw.deserialize(initialState, { terse: true }),
  };

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = (type) => {
    const { state } = this.state
    return state.marks.some(mark => mark.type == type)
  }

  /**
   * On change, save the new state.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state });
    this.debouncedSpellCheck();
    this.maybeSelectError(state);

    setTimeout(() => this.removeStaleSuggestions(), 0);
  }

  removeStaleSuggestions = () => {
    let { state } = this.state;
    const transform = state.transform();

    state.document.getTextsAsArray().forEach((text) => {
      text.characters.forEach((character, offset, chars) => {
        const mark = character.marks.filter(typeIsSpelling).first();
        if (mark) {
          const length = mark.data.get('length');
          const position = mark.data.get('position');
          if ((position + 1 < length && !isSameError(chars, offset + 1, mark, add1)) ||
              (position > 0 && !isSameError(chars, offset - 1, mark, sub1))) {
            removeSpellingSuggestion(transform, text.key, chars, offset, position, length, mark);
          }
        }
      });
    });


    state = transform.apply(false);
    this.setState({ state });
  }

  spellCheck = async () => {
    const text = Plain.serialize(this.state.state);
    let suggestions;

    this.setCharacterOffsetMarks();

    try {
      this._request = requestSpellCheck(text);
      suggestions = await this._request;
    } finally {
      this._request = null;
    }

    this.markSpellCheckSuggestions(suggestions);
  }

  setCharacterOffsetMarks = () => {
    let { state } = this.state;
    let offset = 0;
    const transform = state.transform();

    state.document.getTextsAsArray().forEach((text) => {
      text.characters.forEach((character, currOffset) => {
        const newMark = { type: 'offset', data: { offset } };
        const currMark = character.marks.filter(typeIsOffset).first();
        if (currMark) {
          transform.setMarkByKey(text.key, currOffset, 1, currMark, newMark);
        } else {
          transform.addMarkByKey(text.key, currOffset, 1, newMark);
        }
        offset = offset + 1;
      });
    });

    state = transform.apply(false);
    this.setState({ state });
  }

  markSpellCheckSuggestions = (suggestions) => {
    let { state } = this.state;
    const transform = state.transform();

    suggestions
    .filter(negate(ignoreSuggestion))
    .forEach((suggestion) => {
      state.document.getTextsAsArray().forEach((text) => {
        const chars = text.characters;
        chars.forEach((character, currOffset) => {
          removeUnignoredSpellingMarks(transform, text.key, currOffset, character);

          const mark = character.marks.filter(typeIsOffset).first();
          if (mark && (mark.data.get('offset') === suggestion.offset) &&
              unchanged(chars, currOffset, suggestion.length) &&
              !ignoredError(chars, currOffset, suggestion.length, suggestion)) {
            addSpellingSuggestion(text.key, suggestion, chars, currOffset, transform);
          }
        });
      });
    });

    state = transform.apply(false);
    this.setState({ state });
  }

  maybeSpellCheck = () => {
    if (!this._request) {
      this.spellCheck();
    } else {
      // Request could be taking longer than the SPELL_CHECK_WAIT_TIME_MS so we
      // can queue up another request to take place after
      // SPELL_CHECK_WAIT_TIME_MS
      this.debouncedSpellCheck();
    }
  }

  debouncedSpellCheck = debounce(
    () => this.maybeSpellCheck(),
    SPELL_CHECK_WAIT_TIME_MS,
    { maxWait: SPELL_CHECK_MAX_WAIT_TIME_MS }
  );

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickMark = (e, type) => {
    e.preventDefault()
    let { state } = this.state

    state = state
      .transform()
      .toggleMark(type)
      .apply()

    this.setState({ state })
  }

  /**
   * When the portal opens, cache the menu element.
   *
   * @param {Element} portal
   */

  onOpen = (portal) => {
    this.setState({ menu: portal.firstChild })
  }

  onOpenSpellChecker = (portal) => {
    this.setState({ spellChecker: portal.firstChild })
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render = () => {
    return (
      <div>
        {this.renderMenu()}
        {this.renderSpellChecker()}
        {this.renderEditor()}
      </div>
    )
  }

  /**
   * Render the hovering menu.
   *
   * @return {Element}
   */

  renderMenu = () => {
    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="menu hover-menu">
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
        </div>
      </Portal>
    )
  }

  onClickReplacement = (e, value) => {
    let { state } = this.state;

    state = state
      .transform()
      .delete()
      .insertText(value)
      .apply();

    this.setState({
      state,
      suggestionOnDisplay: null
    });
  }

  onIgnoreSuggestion = (e) => {
    const { state, suggestionOnDisplay } = this.state;
    const { anchorKey: key, anchorOffset: base } = state.selection;
    const characters = state.document.getDescendant(key).characters;
    const transform = state.transform();
    const length = suggestionOnDisplay.data.get('length');
    const position = suggestionOnDisplay.data.get('position');

    for (let i = 0; i < length; i++) {
      const character = characters.get(base + i);
      const remove = character.marks.filter(matchesErrorMark(addX(i - position), suggestionOnDisplay)).first();
      const newData = remove.data.set('ignored', true);
      const replace = remove.set('data', newData);
      transform.removeMarkByKey(key, base + i, 1, remove);
      transform.addMarkByKey(key, base + i, 1, replace);
    }

    this.setState({
      state: transform.apply(),
      suggestionOnDisplay: null
    });
  }

  renderReplacement = ({ value }) => {
    const onMouseDown = (e) => this.onClickReplacement(e, value);

    return (
      <li key={value} onMouseDown={onMouseDown}>{value}</li>
    );
  }

  renderSuggestionOnDisplay = () => {
    const { suggestionOnDisplay } = this.state;
    if (!suggestionOnDisplay) {
      return null;
    }

    const replacements = suggestionOnDisplay.data.get('replacements');
    const onMouseDown = (e) => this.onIgnoreSuggestion(e);

    return (
      <div>
        {suggestionOnDisplay.data.get('message')}
        <ul>
          {replacements.map(this.renderReplacement)}
        </ul>
        <div onMouseDown={onMouseDown}>Ignore</div>
      </div>
    );
  }

  renderSpellChecker = () => {
    return (
      <Portal isOpened onOpen={this.onOpenSpellChecker}>
        <div className="menu hover-menu">
          {this.renderSuggestionOnDisplay()}
        </div>
      </Portal>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = e => this.onClickMark(e, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
          spellCheck={false}
        />
      </div>
    )
  }

  /**
   * Update the menu's absolute position.
   */

  maybeSelectError = (state) => {
    const { suggestionOnDisplay } = this.state;
    const { anchorKey, anchorOffset, focusKey, focusOffset, isCollapsed, isBackward } = state.selection;

    const shouldCloseSpellChecker = (
      state.isBlurred ||
      isBackward ||
      focusKey !== anchorKey ||
      (suggestionOnDisplay && isCollapsed)
    );
    if (shouldCloseSpellChecker) {
      this.setState({ suggestionOnDisplay: null });
      return;
    }

    const length = focusOffset - anchorOffset;
    const text = state.document.getDescendant(anchorKey);
    const character = text.characters.get(anchorOffset);
    if (!character) {
      this.setState({ suggestionOnDisplay: null });
      return;
    }
    const suggestions = character.marks.filter(typeIsSpelling);
    if (suggestions.size === 0) {
      this.setState({ suggestionOnDisplay: null });
      return;
    }

    if (length === 0) {
      const suggestion = suggestions.first();
      if (suggestion.data.get('ignored')) {
        return;
      }

      const transform = state.transform();
      const newAnchorOffset = anchorOffset - suggestion.data.get('position');
      const newFocusOffset = newAnchorOffset + suggestion.data.get('length');
      const newState = transform
        .moveOffsetsTo(newAnchorOffset, newFocusOffset)
        .apply(false);
      this.setState({ state: newState, suggestionOnDisplay: suggestion });
      return;
    }

    const suggestion = suggestions
      .filter((mark) => mark.data.get('position') === 0)
      .filter((mark) => mark.data.get('length') === length)
      .first();
    if (!suggestion) {
      this.setState({ suggestionOnDisplay: null });
    }
  }

  updateMenu = () => {
    const { spellChecker, suggestionOnDisplay } = this.state
    if (!spellChecker) return

    if (!suggestionOnDisplay) {
      spellChecker.removeAttribute('style')
      return
    }

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    spellChecker.style.opacity = 1
    spellChecker.style.top = `${rect.top + window.scrollY - spellChecker.offsetHeight}px`
    spellChecker.style.left = `${rect.left + window.scrollX - spellChecker.offsetWidth / 2 + rect.width / 2}px`
  }
}

/**
 * Export.
 */

export default HoveringMenu
