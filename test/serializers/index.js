
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
  html: Html,
  plain: Plain,
  raw: Raw
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
            const input = readMetadata.sync(resolve(innerDir, 'input.yaml'))
            const expected = readMetadata.sync(resolve(innerDir, 'output.yaml'))
            const Serializer = SERIALIZERS[serializer]
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
            const input = require(resolve(innerDir, 'input.js')).default
            const expected = readMetadata.sync(resolve(innerDir, 'output.yaml'))
            const Serializer = SERIALIZERS[serializer]
            const serialized = Serializer.serialize(input)
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
