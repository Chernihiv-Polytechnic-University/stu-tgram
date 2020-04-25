const { rmdirSync } = require('fs')
const { resolve } = require('path')
const version = require('./version')

if (!version.isTwelvePlus()) {
    throw new Error('Node version should be >= 12.x')
}

const dirs = process.argv.slice(2)
const paths = dirs.map(dir => resolve(process.cwd(), dir))

paths.forEach(path => rmdirSync(path, { recursive: true }))
