import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import LRU from 'lru-cache';
import semver from 'semver';

let _hasYarn = false;
const _yarnProjects = new LRU({
  max: 10,
  maxAge: 1000
})
let _hasGit = false;
const _gitProjects = new LRU({
  max: 10,
  maxAge: 1000
})

// 环境检测
const hasYarn = () => {
  if (_hasYarn !== null) {
    return _hasYarn
  }
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return (_hasYarn = true)
  } catch (e) {
    return (_hasYarn = false)
  }
}

// 检测是否有yarn
const hasProjectYarn = (cwd: string) => {
  if (_yarnProjects.has(cwd)) {
    return checkYarn(_yarnProjects.get(cwd))
  }

  const lockFile = path.join(cwd, 'yarn.lock')
  const result = fs.existsSync(lockFile)
  _yarnProjects.set(cwd, result)
  return checkYarn(result)
}

function checkYarn (result: any) {
  if (result && !exports.hasYarn()) throw new Error(`由于项目依赖Yarn，请安装后重试。`)
  return result
}

const hasGit = () => {
  if (_hasGit !== null) {
    return _hasGit
  }
  try {
    execSync('git --version', { stdio: 'ignore' })
    return (_hasGit = true)
  } catch (e) {
    return (_hasGit = false)
  }
}

const hasProjectGit = (cwd: string) => {
  if (_gitProjects.has(cwd)) {
    return _gitProjects.get(cwd)
  }

  let result
  try {
    execSync('git status', { stdio: 'ignore', cwd })
    result = true
  } catch (e) {
    result = false
  }
  _gitProjects.set(cwd, result)
  return result
}

let _hasPnpm = false;
let _hasPnpm3orLater = false;
const _pnpmProjects = new LRU({
  max: 10,
  maxAge: 1000
})

const hasPnpm3OrLater = () => {
  if (_hasPnpm3orLater != null) {
    return _hasPnpm3orLater
  }
  try {
    const pnpmVersion = execSync('pnpm --version', {
      stdio: ['pipe', 'pipe', 'ignore']
    }).toString()
    // there's a critical bug in pnpm 2
    // https://github.com/pnpm/pnpm/issues/1678#issuecomment-469981972
    // so we only support pnpm >= 3.0.0
    _hasPnpm = true
    _hasPnpm3orLater = semver.gte(pnpmVersion, '3.0.0')
    return _hasPnpm3orLater
  } catch (e) {
    return (_hasPnpm3orLater = false)
  }
}

const hasProjectPnpm = (cwd: string) => {
  if (_pnpmProjects.has(cwd)) {
    return checkPnpm(_pnpmProjects.get(cwd))
  }

  const lockFile = path.join(cwd, 'pnpm-lock.yaml')
  const result = fs.existsSync(lockFile)
  _pnpmProjects.set(cwd, result)
  return checkPnpm(result)
}

function checkPnpm (result: any) {
  if (result && !exports.hasPnpm3OrLater()) {
    throw new Error(`项目所依赖的 pnpm${_hasPnpm ? ' >= 3' : ''} 请安装后重试`)
  }
  return result
}

// OS
const isWindows = process.platform === 'win32'
const isMacintosh = process.platform === 'darwin'
const isLinux = process.platform === 'linux'

export {
	hasYarn,
	hasGit,
	hasProjectYarn,
	hasProjectGit,
	hasPnpm3OrLater,
	hasProjectPnpm,
	isWindows,
	isMacintosh,
	isLinux
}
