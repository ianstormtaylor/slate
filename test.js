import { Raw, Inline } from './src'

function printNode(node, depth = 0) {
    const indent = Array(depth * 2).join(' ')

    if (node.kind === 'text') {
        console.log(`${indent}#text key=${node.key}`)
        const ranges = node.getRanges()
        ranges.forEach(range => {
            console.log(`${indent}  ${JSON.stringify(range.text)}`)
        })
    }
    else {
        console.log(`${indent}#${node.kind + (node.isVoid ? '(void)' : '')} type=${node.type} key=${node.key} ${node.data ? JSON.stringify(node.data.toJS()) : ''}`)
        node.nodes.forEach(child => printNode(child, depth + 1))
    }
}

function print(st) {
    printNode(st.document)
    console.log('')
}

const state = Raw.deserialize({
    nodes: [
        {
            kind: 'block',
            type: 'paragraph',
            key: 'container',
            nodes: [
                {
                    key: 'in1',
                    kind: 'inline',
                    type: 'link',
                    nodes: [
                        {
                            key: 'sometext',
                            kind: 'text',
                            text: 'Hello'
                        },
                        {
                            key: 'in2',
                            kind: 'inline',
                            type: 'image',
                            isVoid: true,
                            nodes: [
                                {
                                    kind: 'text',
                                    text: ' '
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}, { terse: true })

print(state)

const newState = state.transform()
    .moveNodeByKey('in2', 'container')
    .apply()

print(newState)
