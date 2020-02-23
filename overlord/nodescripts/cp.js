const { copyFileSync, basename } = require('fs')
const { resolve, join } = require('path')
const version = require('./version')

if (!version.isTwelve()) {
    throw new Error('Node version should be >= 12.x')
}

const target = resolve(process.cwd(), process.argv[2])

process.argv.slice(3)
    .map(path => ({ path: resolve(process.cwd(), path), name: basename(path) }))
    .map(({ path, name }) => {
        copyFileSync(path, resolve(target, name))
    })
