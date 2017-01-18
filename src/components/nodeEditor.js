import Debug from 'debug'
import React from 'react'
import Node from 'slate/lib/components/node'
import {Subscriber} from 'react-broadcast'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:nodeEditor')

/**
 * Content.
 *
 * @type {Component}
 */

class NodeEditor extends React.Component {
	render = () => {
		let {node} = this.props;

		if(!node){
			return null;
		}

		return <Subscriber channel="slateEditor">
			{props => {
				const { editor, readOnly, schema, state } = props;
				node = typeof node == 'function' ? node(state) : node;

				let style = {
				  // Prevent the default outline styles.
				  outline: 'none',
				  // Preserve adjacent whitespace and new lines.
				  whiteSpace: 'pre-wrap',
				  // Allow words to break if they are too long.
				  wordWrap: 'break-word',
				  // COMPAT: In iOS, a formatting menu with bold, italic and underline
				  // buttons is shown which causes our internal state to get out of sync in
				  // weird ways. This hides that. (2016/06/21)
				  ...(readOnly ? {} : { WebkitUserModify: 'read-write-plaintext-only' }),
				  // Allow for passed-in styles to override anything.
				  ...props.style,
				}
				return <div
					contentEditable={!readOnly}
					suppressContentEditableWarning
					style={style}
				  ><Node
					key={node.key}
					node={node}
					parent={state.document.getParent(node.key)}
					schema={schema}
					state={state}
					editor={editor}
					readOnly={readOnly}
				  />
				</div>
			}}
		</Subscriber>
	}
}

export default NodeEditor
