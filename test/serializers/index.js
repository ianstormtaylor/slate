
import assert from 'assert'
import fs from 'fs'
import readMetadata from 'read-metadata'
import { Html, Plain, Raw } from '../..'
import { equal, strictEqual } from '../helpers/assert-json'
import { resolve } from 'path'

/**
 * Serializers.
 */

const SERIALIZERS = {

  html: (dir) => {
    const module = require(dir)
    const html = new Html(module)
    return {
      extension: 'html',
      deserialize: html.deserialize,
      serialize: html.serialize,
      read: file => fs.readFileSync(file, 'utf8').trim()
    }
  },

  plain: (dir) => ({
    extension: 'txt',
    deserialize: Plain.deserialize,
    serialize: Plain.serialize,
    read: file => fs.readFileSync(file, 'utf8').trim()
  }),

  raw: (dir) => ({
    extension: 'yaml',
    deserialize: Raw.deserialize,
    serialize: Raw.serialize,
    read: file => readMetadata.sync(file)
  })

}

/**
 * Tests.
 */

describe('serializers', () => {
  const serializers = fs.readdirSync(resolve(__dirname, './fixtures'))

  for (const serializer of serializers) {
    describe(serializer, () => {
      describe('deserialize()', () => {
        const dir = resolve(__dirname, './fixtures', serializer, 'deserialize')
        const tests = fs.readdirSync(dir)

        for (const test of tests) {
          it(test, () => {
            const innerDir = resolve(dir, test)
            const Serializer = SERIALIZERS[serializer](innerDir)

            const expected = readMetadata.sync(resolve(innerDir, 'output.yaml'))
            const input = Serializer.read(resolve(innerDir, `input.${Serializer.extension}`))
            const state = Serializer.deserialize(input)
            const json = state.document.toJS()
            strictEqual(clean(json), expected)
          })
        }
      })

      describe('serialize()', () => {
        const dir = resolve(__dirname, './fixtures', serializer, 'serialize')
        const tests = fs.readdirSync(dir)

        for (const test of tests) {
          it(test, () => {
            const innerDir = resolve(dir, test)
            const Serializer = SERIALIZERS[serializer](innerDir)

            const input = require(resolve(innerDir, 'input.js')).default
            const expected = Serializer.read(resolve(innerDir, `output.${Serializer.extension}`))
            const serialized = Serializer.serialize(input)
            debugger
            strictEqual(serialized, expected)
          })
        }
      })
    })
  }
})

/**
 * Clean a `json` object of dynamic `key` properties.
 *
 * @param {Object} json
 * @return {Object}
 */

function clean(json) {
  const { key, cache, decorations, ...props } = json

  if (props.nodes) {
    props.nodes = props.nodes.map(clean)
  }

  return props
}
