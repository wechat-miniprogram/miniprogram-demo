const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const chalk = require('chalk')
const debug = require('debug')('cli')
const pbjs = require('protobufjs/cli/pbjs')

const log = (...msg) => {
  console.log(chalk.blue('svrkit-utils'), ...msg)
}

function main() {
  debug('process.cwd', process.cwd())
  debug('yargs.argv', yargs.argv)

  if (yargs.argv.config) {
    const configPath = path.resolve(process.cwd(), yargs.argv.config)
    const config = require(configPath)

    const protos = config.map(c => path.resolve(path.dirname(configPath), c.proto))

    if (yargs.argv.output) {
      if (!yargs.argv.output.endsWith('.js')) {
        throw new Error('output file name must ends with .js')
      }
    }

    const outputDest = yargs.argv.output || path.resolve(path.dirname(configPath), 'svrkit-utils.js')
    const outputFileName = path.basename(outputDest)
    const outputFilePath = path.resolve(process.cwd(), outputDest)

    debug('outputDest', outputDest)
    debug('outputFilePath', outputFilePath)

    const staticModuleFileName = `${outputFileName.slice(0, -3)}.static.js`
    const staticModuleFilePath = path.resolve(path.dirname(outputFilePath), staticModuleFileName)

    const staticJsonFileName = `${outputFileName.slice(0, -3)}.static.json`
    const staticJsonFilePath = path.resolve(path.dirname(outputFilePath), staticJsonFileName)

    log('generating static module')
    const pbjsArgs = ['-t', 'static-module', '-w', 'commonjs', '-l', 'eslint-disable', '-o', staticModuleFilePath, ...protos]

    if (yargs.argv.keepCase) {
      pbjsArgs.unshift('--keep-case')
    }

    pbjs.main(pbjsArgs, (err, out) => {
      if (err) {
        throw err
      }

      const staticModuleContent = fs.readFileSync(staticModuleFilePath, 'utf8')
      fs.writeFileSync(staticModuleFilePath, `// #lizard forgives
${staticModuleContent}`, 'utf8')

      log('static module generated')

      log('generating json descriptors')
      pbjs.main(['-t', 'json', '-o', staticJsonFilePath, ...protos], (err, out) => {
        if (err) {
          throw err
        }

        log('json descriptors generated')

        try {
          const protoUtils = fs.readFileSync(path.join(__dirname, './svrkit-utils-template.js'), 'utf8')

          let svrkitConfigRelativePath = path.relative(path.dirname(outputDest), configPath)
          if (!svrkitConfigRelativePath.startsWith('.')) {
            svrkitConfigRelativePath = `./${svrkitConfigRelativePath}`
          }

          const output = `
const config = require('${svrkitConfigRelativePath}')
const proto = require('./${staticModuleFileName}')
const protoJSON = require('./${staticJsonFileName}')
${protoUtils}
`

          fs.writeFileSync(outputFilePath, output, 'utf8')

          log(`${outputFileName} generated`)
        } catch (err) {
          throw err
        }
      })
    })
  } else {
    throw new Error('config file must be provided')
  }
}

module.exports = {
  main,
}
