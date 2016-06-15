
import LeafNode from './leaf-node'
import React from 'react'
import xor from 'lodash/xor'

/**
 * TextNode.
 */

class TextNode extends React.Component {

  static propTypes = {
    node: React.PropTypes.object.isRequired,
    renderMark: React.PropTypes.func.isRequired,
  };

  render() {
    const { node, renderMark } = this.props
    const { characters } = node
    const ranges = characters
      .toArray()
      .reduce((ranges, char, i) => {
        const previous = characters[i - 1]
        const { text } = char
        const marks = char.marks.toArray().map(mark => mark.type)

        if (previous) {
          const previousMarks = previous.marks.toArray().map(mark => mark.type)
          const diff = xor(marks, previousMarks)
          if (!diff.length) {
            const previousRange = ranges[ranges.length - 1]
            previousRange.text += text
            return ranges
          }
        }

        const offset = ranges.map(range => range.text).join('').length
        ranges.push({ text, marks, offset })
        return ranges
      }, [])

    const leaves = ranges.map((range) => {
      const key = `${node.key}.${range.offset}-${range.text.length}`
      const styles = range.marks.reduce((styles, mark) => {
        return {
          ...styles,
          ...renderMark(mark),
        }
      }, {})

      return (
        <LeafNode
          key={key}
          styles={styles}
          text={range.text}
        />
      )
    })

    return (
      <span key={node.key} data-type='text'>{leaves}</span>
    )
  }

  // render() {
  //   const { node, renderMark } = this.props
  //   const { text, marks } = node
  //   const length = text.length
  //   const leaves = []
  //   let index = 0
  //   let previousIndex = index

  //   while (index < length) {
  //     const currentMarks = findMarks(marks, index)
  //     const nextMarks = findMarks(marks, index + 1)
  //     const changes = xor(currentMarks, nextMarks)

  //     if (!changes.length && index != length - 1) {
  //       index++
  //       continue
  //     }

  //     const key = `${node.key}.${previousIndex}-${index}`
  //     const string = text.slice(previousIndex, index)
  //     const styles = currentMarks.reduce((styles, mark) => {
  //       return {
  //         ...styles,
  //         ...renderMark(mark),
  //       }
  //     }, {})

  //     const leaf = (
  //       <LeafNode
  //         key={key}
  //         styles={styles}
  //         text={string}
  //         />
  //     )

  //     leaves.push(leaf)
  //     previousIndex = index
  //     index++
  //   }

  //   return (
  //     <span key={node.key} data-type='text'>{leaves}</span>
  //   )
  // }

}

/**
 * Find matching `marks` at `index`.
 *
 * @param {Array} marks
 * @param {Number} index
 * @return {Array} marks
 */

function findMarks(marks, index) {
  return marks
    .filter(mark => mark.start < index)
    .filter(mark => mark.end + 1 > index)
    .map(mark => mark.type)
    .sort()
}

/**
 * Export.
 */

export default TextNode
