const { F_OK } = require('fs').constants
const { readdir, mkdir, lstat, copyFile, access } = require('fs').promises
const { promisify } = require('util')
const { resolve, join } = require('path')
const childProcess = require('child_process')
const version = require('./version')

const exec = promisify(childProcess.exec)

const FORCE_FLAG = '--f'

if (!version.isTwelvePlus()) {
    throw new Error('Node version should be >= 12.x')
}

const libsDir = resolve(__dirname, '..', '..', 'libs')

const isDirExists = async (path) => {
    return await access(path, F_OK)
        .then(() => true)
        .catch(() => false)
}

const mapSeries = (fn) => async (arr) => {
    for (let i = 0; i < arr.length; i++) {
        await fn(arr[i], i, arr)
    }
}

const findLibsAndFlags = async () => {
    const existedLibs = await readdir(libsDir)
    const requestedLibs = process.argv.slice(2)

    const force = requestedLibs.includes(FORCE_FLAG)

    return requestedLibs
        .filter(lib => existedLibs.includes(lib))
        .map(libName => ({ libName, force }))
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

const addLib = async ({ libName, force }, i, arr) => {
    const isDistExist = force ? false : await isDirExists(resolve(libsDir, libName, 'dist'))
    const isModulesExist = force ? false : await isDirExists(resolve(libsDir, libName, 'node_modules'))

    const command = (isDistExist && isModulesExist) ? 'compile-component' : 'compile'

    console.log(`[ ${arr.length}:${i + 1} ]. ${ (isDistExist && isModulesExist) ? 'Only transpile and copy Lib' : 'Fully compile lib'}: ${libName}.`)

    await exec(`npm run --prefix ${resolve(libsDir, libName)} ${command}`).catch(console.error)
    await copyFolder(resolve(libsDir, libName, 'dist'), resolve(process.cwd(), 'node_modules', 'libs', libName)).catch(console.error)

    console.log(`[ ${arr.length}:${i + 1} ]. Lib: ${libName} compiled.`)
}

findLibsAndFlags().then(mapSeries(addLib))

