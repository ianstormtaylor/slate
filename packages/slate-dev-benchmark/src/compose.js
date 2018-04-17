/* global Promise */
import { errorLog } from './logger'

export default function compose(list, name = 'makeRun') {
  return dispatch(0)
  function dispatch(index) {
    if (index === list.length) return Promise.resolve(true)
    const node = list[index]
    return new Promise(resolve => resolve(node[name]()))
      .catch(err => errorLog(err))
      .then(() => dispatch(index + 1))
  }
}
