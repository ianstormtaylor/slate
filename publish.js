#!/usr/bin/env node

/* eslint-disable no-console */

/*

Make a build commit of our forked slate packages and push this build commit to
the respective fork repos, adding the package's version as a tag.

*/

const path = require('path')
const Promise = require('q')
const program = require('commander')
const execCommand = require('child-process-promise').exec

/* Parse command line args */

program
  .usage('[options]')
  .option('--skip-git', 'Stop before creating a commit')
  .parse(process.argv)

const PACKAGES = [
  {
    name: 'slate-core',
    dir: 'packages/slate',
    // Will also contains
    // version: string
    // path: string
  },
  {
    name: 'slate-react',
    dir: 'packages/slate-react',
  },
]

const projectPath = path.join(process.cwd(), program.dir || '.')

PACKAGES.forEach(pkg => {
  pkg.path = path.join(projectPath, pkg.dir)

  let pkgJson
  try {
    pkgJson = require(path.join(pkg.path, 'package.json'))
  } catch (e) {
    console.error('Could not load package.json at', projectPath)
    process.exit(1)
  }

  pkg.version = pkgJson.version
})

// Run a chain of promise on all packages
function forEachPackage(fn) {
  return PACKAGES.reduce((promise, pkg) => {
    return promise.then(() => {
      return fn(pkg)
    })
  }, Promise())
}

function exec(command) {
  console.log(` ${command}`)
  return execCommand(command)
}

return Promise()
  .then(() => {
    // return exec('git diff-index --quiet HEAD --') // Avoid committing unwanted changes
    //   .fail(() => {
    //     console.error('Your git index is not clean. Aborting')
    //     process.exit(1)
    //   })
  })
  .then(() => {
    console.log('Testing ...')
    // return exec('yarn run test')
  })
  .then(() => {
    // console.log('Building ...')
    // return exec('yarn run bootstrap', { caputre: ['stdout', 'stderr'] })
  })
  .then(() => {
    console.log('Staging ...')
    return forEachPackage(pkg => {
      const libPath = path.join('./', pkg.dir, 'lib')
      return exec(`git add -f ${libPath}`)
    })
  })
  .then(() => {
    if (program.skipGit) {
      return
    }

    console.log('Committing ...')
    return exec('git commit -m "Build 🛠"')
      .then(() => {
        console.log('Updating branches ...')
        return forEachPackage(pkg => {
          return exec(
            `splitsh-lite --prefix=${pkg.dir} --target=refs/heads/${pkg.name}`
          )
        })
      })
      .then(() => {
        console.log('Pushing to repos ...')
        return forEachPackage(pkg => {
          const remote = pkg.name
          const branch = pkg.name

          return exec(`git push ${remote} ${branch}`)
        })
      })
      .then(() => {
        console.log('Tagging ...')
        return forEachPackage(pkg => {
          console.log(`Tagging ${pkg.name} with tag: ${pkg.version}`)
          const remote = pkg.name
          const branch = pkg.name

          return exec(`git push ${remote} ${branch}:refs/tags/${pkg.version}`)
        })
      })
  })
  .then(() => {
    console.log('Done.')
  })
