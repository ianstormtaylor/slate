import React from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized'
import Types from 'prop-types'

/**
 * List.
 *
 * @type {Component}
 */

class DynamicHeightList extends React.PureComponent {
  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    height: Types.number,
    list: Types.arrayOf(Types.any),
    rowRenderer: Types.func,
    width: Types.number,
  }

  constructor(props) {
    super(props)

    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 10,
    })
  }

  rowRenderer = ({ key, index, parent, style }) => {
    const { rowRenderer } = this.props

    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}
      >
        {rowRenderer({ key, index, parent, style })}
      </CellMeasurer>
    )
  }

  render() {
    const { height, list, width } = this.props

    return (
      <List
        deferredMeasurementCache={this.cache}
        height={height}
        overscanRowCount={10}
        rowCount={list.length}
        rowHeight={this.cache.rowHeight}
        rowRenderer={this.rowRenderer}
        width={width}
      />
    )
  }
}

function Wrapper({ list, height, rowRenderer }) {
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <div style={{ width }}>
          <DynamicHeightList
            list={list}
            height={height}
            width={width}
            rowRenderer={rowRenderer}
          />
        </div>
      )}
    </AutoSizer>
  )
}

export default Wrapper
