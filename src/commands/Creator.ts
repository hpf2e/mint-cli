import chalk from 'chalk';
import execa from 'execa';
import inquirer from 'inquirer';
import EventEmitter from 'events';
import loadRemotePreset from '../utils/loadRemotePreset';
import writeFileTree from '../utils/writeFileTree';
import copyFile from '../utils/copyFile';
import generateReadme from '../utils/generateReadme';
import { installDeps } from '../utils/installDeps';
import { defaults } from './options';
import {
  hasYarn,
  hasGit,
  hasProjectGit,
  hasPnpm3OrLater,
} from '../utils/common/env';
import { log, warn, error, clearConsole } from '../utils/common/logger';
import exit from '../utils/common/exit';
import { logWithSpinner, stopSpinner } from '../utils/common/spinner';
import Apk from '../../package.json';

export default class Creator extends EventEmitter {
  name: string;
  context: string;

  constructor(name: string, context: string) {
    super();

    this.name = name;
    this.context = context;

    this.run = this.run.bind(this);
    this.shouldInitGit = this.shouldInitGit.bind(this);
  }

  async create(cliOptions: any = {}, preset?: any) {
    const { run, name, context } = this;
    if (cliOptions.preset) {
      // mint create foo --preset mobx
      preset = await this.resolvePreset(cliOptions.preset, cliOptions.clone);
    } else {
      preset = await this.resolvePreset(
        defaults.presets.defaultPreset,
        cliOptions.clone,
      );
    }
    await clearConsole();
    log(chalk.blue.bold(`mint CLI v${Apk.version}`));
    logWithSpinner(`✨`, `正在创建项目 ${chalk.yellow(context)}.`);
    this.emit('creation', { event: 'creating' });
    stopSpinner();

    // 设置文件名，版本号等
    const { pkgVers, pkgDes } = await inquirer.prompt([
      {
        name: 'pkgVers',
        message: `请输入项目版本号`,
        default: '0.0.1',
      },
      {
        name: 'pkgDes',
        message: `请输入项目简介`,
        default: 'project created by mint-cli',
      },
    ]);
    // 将下载的临时文件拷贝到项目中
    const pkgJson = await copyFile(preset.tmpdir, preset.targetDir);
    const pkg = Object.assign(pkgJson, {
      version: pkgVers,
      description: pkgDes,
    });
    // write package.json
    log();
    logWithSpinner('📄', `生成 ${chalk.yellow('package.json')} 等模板文件`);
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2),
    });
    // 包管理
    const packageManager =
      (hasYarn() ? 'yarn' : null) || (hasPnpm3OrLater() ? 'pnpm' : 'npm');
    await writeFileTree(context, {
      'README.md': generateReadme(pkg, packageManager),
    });
    const shouldInitGit = this.shouldInitGit(cliOptions);
    if (shouldInitGit) {
      logWithSpinner(`🗃`, `初始化Git仓库`);
      this.emit('creation', { event: 'git-init' });
      await run('git init', '');
    }
    // 安装依赖
    stopSpinner();
    log();
    logWithSpinner(`⚙`, `安装依赖`);
    // log(`⚙  安装依赖中，请稍等...`)
    await installDeps(context, packageManager, cliOptions.registry);
    // commit initial state
    let gitCommitFailed = false;
    if (shouldInitGit) {
      await run('git add -A');
      const msg = typeof cliOptions.git === 'string' ? cliOptions.git : 'init';
      try {
        await run('git', ['commit', '-m', msg]);
      } catch (e) {
        gitCommitFailed = true;
      }
    }
    // log instructions
    stopSpinner();
    log();
    log(`🎉  项目创建成功 ${chalk.yellow(name)}.`);
    if (!cliOptions.skipGetStarted) {
      log(
        `👉  请按如下命令，开始愉快开发吧！\n\n` +
          (this.context === process.cwd()
            ? ``
            : chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`)) +
          chalk.cyan(
            ` ${chalk.gray('$')} ${
              packageManager === 'yarn'
                ? 'yarn start'
                : packageManager === 'pnpm'
                ? 'pnpm run start'
                : 'npm start'
            }`,
          ),
      );
    }
    log();
    this.emit('creation', { event: 'done' });
    if (gitCommitFailed) {
      warn(
        `因您的git username或email配置不正确，无法为您初始化git commit，\n` +
          `请稍后自行git commit。\n`,
      );
    }
  }

  async resolvePreset(name: string, clone: boolean) {
    let preset = null;
    logWithSpinner(`Fetching remote preset ${chalk.cyan(name)}...`);
    this.emit('creation', { event: 'fetch-remote-preset' });
    try {
      preset = await loadRemotePreset(name, this.context, clone);
      stopSpinner();
    } catch (e) {
      stopSpinner();
      error(`Failed fetching remote preset ${chalk.cyan(name)}:`);
      throw e;
    }
    // 默认使用default参数
    if (name === 'default' && !preset) {
      preset = defaults.presets.defaultPreset;
    }
    if (!preset) {
      error(`preset "${name}" not found.`);
      exit(1);
    }
    return preset;
  }

  run(command: string, args?: any) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  shouldInitGit(cliOptions: any) {
    if (!hasGit()) {
      return false;
    }
    // --git
    if (cliOptions.forceGit) {
      return true;
    }
    // --no-git
    if (cliOptions.git === false || cliOptions.git === 'false') {
      return false;
    }
    // default: true unless already in a git repo
    return !hasProjectGit(this.context);
  }
}
