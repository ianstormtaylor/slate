/* eslint-disable prefer-template,no-console */

const React = require('react')
const fs = require('fs')
const parse5 = require('parse5')
// const pretty = require('pretty')
// const prettifyXml = require('prettify-xml')
const { pd } = require('pretty-data')
// const readMetadata = require('read-metadata')
const yaml = require('yaml-js')
const { resolve } = require('path')
const { Html, State } = require('..')

const html = new Html({
  parseHtml: parse5.parseFragment,
  rules: [
    {
      serialize(obj, children) {
        switch (obj.kind) {
          case 'block':
          case 'inline': {
            return React.createElement(`x-${obj.type}`, obj.data.toJSON(), children)
          }
          case 'document':
          case 'state': {
            return React.createElement(`x-${obj.kind}`, null, children)
          }
          case 'mark': {
            return React.createElement(`x-${obj.type[0]}`, obj.data.toJSON(), children)
          }
        }
      }
    }
  ]
})

const failures = []
const dir = resolve(__dirname, '../test/changes')
const categories = fs.readdirSync(dir).filter(c => c[0] != '.' && c != 'index.js')

for (const category of categories) {
  // if (category != 'at-current-range') continue

  const categoryDir = resolve(dir, category)
  const methods = fs.readdirSync(categoryDir).filter(c => c[0] != '.')

  for (const method of methods) {
    // if (method != 'add-mark') continue

    const methodDir = resolve(categoryDir, method)
    const tests = fs.readdirSync(methodDir).filter(t => t[0] != '.' && !~t.indexOf('.js'))

    for (const test of tests) {
      // if (test != 'across-blocks' && test != 'across-inlines') continue

      try {
        const testDir = resolve(methodDir, test)
        const indexFile = resolve(testDir, 'index.js')
        let index = fs.readFileSync(indexFile, 'utf8')
        index = index.replace(/^import assert.*$/m, '')
        index = index.replace(/function \(state\)/m, 'function (change)')
        index = index.replace(/ *const { document.*\n/m, '')
        index = index.replace(/const next = state\n\s*\.change\(\)/m, 'change')
        index = index.replace(/\n\s*\.state\n/m, '\n')
        index = index.replace(/\n\s*return next\n\s*}/m, '\n}')
        index = index.trim()

        const inputFile = resolve(testDir, 'input.yaml')
        const inputString = fs.readFileSync(inputFile, 'utf8')
        const inputJson = yaml.load(inputString)
        const inputState = State.fromJSON({ document: inputJson })
        const inputJsx = html.serialize(inputState)
        let input = pd.xml(inputJsx)
        input = input.replace(/\n/mg, '\n      ').trim()

        const outputFile = category == 'on-selection'
          ? inputFile
          : resolve(testDir, 'output.yaml')
        const outputString = fs.readFileSync(outputFile, 'utf8')
        const outputJson = yaml.load(outputString)
        const outputState = State.fromJSON({ document: outputJson })
        const outputJsx = html.serialize(outputState)
        let output = pd.xml(outputJsx)
        output = output.replace(/\n/mg, '\n      ').trim()

        const contents = `/** @jsx h */

import h from '../../../helpers/h'

${index}

export const input = (
  <state>
    <document>
      ${input}
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      ${output}
    </document>
  </state>
)
`

        const newFile = `${testDir}.js`
        fs.writeFileSync(newFile, contents)
      }

      catch (e) {
        const name = `${category} ${method} ${test}`
        failures.push(name)
        console.error()
        console.error(`Failure: ${name}`)
        console.error(e)
        console.error()
      }
    }
  }
}

if (failures.length) {
  console.error()
  console.error(`!!! ${failures.length} Failures !!!`)
  console.error(failures.join('\n'))
  console.error()
}

process.exit(0)
