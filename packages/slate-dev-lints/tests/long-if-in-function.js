/* eslint-disable */
function test(a) {
  var b = a
  if (typeof a !== 'number') {
    b += 1
    return b
  }
  return a
}
