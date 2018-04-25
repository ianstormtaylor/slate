const { repo } = require('slate-dev-benchmark')
const { resolve } = require('path')
const { readdirSync } = require('fs')
const { generateReport } = require('./generateReport')

const categoryDir = resolve(__dirname)
const categories = readdirSync(categoryDir).filter(
  c => c[0] != '.' && c.match(/^slate/)
)

categories.forEach(dir => {
  require(`./${dir}`)
})

const reportPath = process.env.COMPARE
  ? './tmp/benchmark-compare.json'
  : './tmp/benchmark-baseline.json'
generateReport(repo, reportPath)
