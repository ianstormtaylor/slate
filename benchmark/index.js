import { repo } from 'slate-dev-benchmark'
import { resolve } from 'path'
import generateReport from './generateReport'

const dirs = ['slate-plain-serializer']

const baseDir = resolve(__dirname)

dirs.forEach(dir => {
  require(`${baseDir}/${dir}`)
})

const reportPath = process.env.COMPARE
  ? './tmp/benchmark-compare-new.json'
  : './tmp/benchmark-baseline-new.json'
generateReport(repo, reportPath)
