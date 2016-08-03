import React from 'react'
import ReactDOM from 'react-dom'

import injector from 'react-frame-aware-selection-plugin'
injector();

import { Editor, Mark, Raw } from '../..'
import initialState from './state.json'
import Frame from 'react-frame-component'

const MARKS = {
    bold: {
        fontWeight: 'bold'
    },
    italic: {
        fontStyle: 'italic'
    }
}

const NODES = {
    'table': props => <table className={"table"}><tbody {...props.attributes}>{props.children}</tbody></table>,
    'table-row': props => <tr {...props.attributes}>{props.children}</tr>,
    'table-cell': props => <td {...props.attributes}>{props.children}</td>
}

class IFrameRendering extends React.Component {

    state = {
        state: Raw.deserialize(initialState, { terse: true })
    };

    onChange = (state) => {
        this.setState({ state })
    }

    /**
     * On backspace, do nothing if at the start of a table cell.
     *
     * @param {Event} e
     * @param {State} state
     * @return {State or Null} state
     */

    onBackspace = (e, state) => {
        if (state.startOffset != 0) return
        e.preventDefault()
        return state
    }

    /**
     * On change.
     *
     * @param {State} state
     */

    onChange = (state) => {
        this.setState({ state })
    }

    /**
     * On delete, do nothing if at the end of a table cell.
     *
     * @param {Event} e
     * @param {State} state
     * @return {State or Null} state
     */

    onDelete = (e, state) => {
        if (state.endOffset != state.startText.length) return
        e.preventDefault()
        return state
    }

    /**
     * On return, do nothing if inside a table cell.
     *
     * @param {Event} e
     * @param {State} state
     * @return {State or Null} state
     */

    onEnter = (e, state) => {
        e.preventDefault()
        return state
    }

    /**
     * On key down, check for our specific key shortcuts.
     *
     * @param {Event} e
     * @param {Object} data
     * @param {State} state
     * @return {State or Null} state
     */

    onKeyDown = (e, data, state) => {
        if (state.startBlock.type != 'table-cell') return
        switch (data.key) {
            case 'backspace': return this.onBackspace(e, state)
            case 'delete': return this.onDelete(e, state)
            case 'enter': return this.onEnter(e, state)
        }
    }

    /**
     * Return a node renderer for a Slate `node`.
     *
     * @param {Node} node
     * @return {Component or Void}
     */

    renderNode = (node) => {
        return NODES[node.type]
    }

    /**
     * Return a mark renderer for a Slate `mark`.
     *
     * @param {Mark} mark
     * @return {Object or Void}
     */

    renderMark = (mark) => {
        return MARKS[mark.type]
    }

    render () {
        const bootstrapCDN =
            <link
                href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                crossOrigin="anonymous">
            </link>

        return (
            <Frame head={bootstrapCDN} style={{width: `100%`, height: '300px'}}>
                <Editor
                    state={this.state.state}
                    onChange={this.onChange}
                    renderNode={this.renderNode}
                    renderMark={this.renderMark}
                    onKeyDown={this.onKeyDown}
                />
            </Frame>
        )
    }

}

export default IFrameRendering
