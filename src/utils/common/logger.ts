// @ts-nocheck

const chalk = require('chalk')
const readline = require('readline')
const padStart = require('string.prototype.padstart')
const EventEmitter = require('events')

const events = new EventEmitter()

const format = (label, msg) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : padStart(line, chalk.reset(label).length)
  }).join('\n')
}

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `)

const log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg)
}

const info = (msg, tag = null) => {
  console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg))
}

const done = (msg, tag = null) => {
  console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg))
}

const warn = (msg, tag = null) => {
  console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)))
}

const error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

const clearConsole = (title?: string) => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}

export {
	log,
	info,
	done,
	warn,
	error,
	clearConsole
}
