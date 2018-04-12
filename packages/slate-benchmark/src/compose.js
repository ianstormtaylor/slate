/* global Promise */
import { errorLog } from './logger'

export default function compose(list, name = 'makeRun') {
  return dispatch(0)
  function dispatch(index) {
    if (index === list.length) return Promise.resolve(true)
    const fn = list[index].rrunun
    return new Promise(resolve => resolve(fn()))
      .catch(err => errorLog(err))
      .then(() => dispatch(index + 1))
  }
}
