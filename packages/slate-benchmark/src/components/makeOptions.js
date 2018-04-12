// Unable to enable maxTime unless rewrite Timer to handle coorountine
const defaultOptions = {
  minTime: 1000,
  maxTime: 2000,
  minTries: 100,
  maxTries: Infinity,
  mode: 'adaptive',
}

export default function(options) {
  for (const key in options) {
    const shallType = typeof defaultOptions[key]
    const inputType = typeof options[key]
    if (shallType !== inputType) {
      throw TypeError(
        `Wrong Input in Config Suite, options[${key}] should be ${shallType}, but the input type is ${inputType}`
      )
    }
  }
  return { ...defaultOptions, options }
}
