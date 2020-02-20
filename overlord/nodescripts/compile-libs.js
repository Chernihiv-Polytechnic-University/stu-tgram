const { readdir, mkdir, lstat, copyFile } = require('fs').promises
const { promisify } = require('util')
const { resolve, join } = require('path')
const childProcess = require('child_process')
const version = require('./version')

const exec = promisify(childProcess.exec)

if (!version.isTwelve()) {
    throw new Error('Node version should be >= 12.x')
}

const libsDir = resolve(__dirname, '..', '..', 'libs')

const mapSeries = (fn) => async (arr) => {
    for (let i = 0; i < arr.length; i++) {
        await fn(arr[i], i, arr)
    }
}

const findLibsToAdd = async () => {
    const existedLibs = await readdir(libsDir)
    const requestedLibs = process.argv.slice(2)

    return requestedLibs.filter(lib => existedLibs.includes(lib))
}

const copyFolder = async (from, to) => {
    await mkdir(to, { recursive: true })
    const elements = await readdir(from)
    await Promise.all(elements.map(async (element) => {
        if ((await lstat(join(from, element))).isFile()) {
            await copyFile(join(from, element), join(to, element))
        } else {
            await copyFolder(join(from, element), join(to, element))
        }
    }))
}

const addLib = async (libName, i, arr) => {
    await exec(`npm run --prefix ${resolve(libsDir, libName)} compile`).catch(console.error)
    await copyFolder(resolve(libsDir, libName, 'dist'), resolve(process.cwd(), 'node_modules', 'libs', libName)).catch(console.error)
    console.log(`[ ${arr.length}:${i + 1} ]. Lib: ${libName} compiled.`)
}

findLibsToAdd().then(mapSeries(addLib))

