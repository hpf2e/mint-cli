import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import Creator from './Creator';
import validatePackageName from 'validate-npm-package-name';
import { error, clearConsole } from '../utils/common/logger';
import { stopSpinner } from '../utils/common/spinner';
import exit from '../utils/common/exit';

/**
 * 创建项目
 * @param {*} projectName
 * @param {*} options
 */
const create = async (projectName = '', options?: any) => {
  const cwd = options.cwd || process.cwd();
  // 是否在当前目录
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || '.');

  const result = validatePackageName(name);
  // 如果所输入的不是合法npm包名，则退出
  if (!result.validForNewPackages) {
    console.error(chalk.red(`不合法的项目名: "${name}"`));
    result.errors &&
      result.errors.forEach((err) => {
        console.error(chalk.red.dim('❌ ' + err));
      });
    result.warnings &&
      result.warnings.forEach((warn) => {
        console.error(chalk.red.dim('⚠️ ' + warn));
      });
    exit(1);
  }

  // 检查文件夹是否存在
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      await clearConsole();
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate project in current directory?`,
          },
        ]);
        if (!ok) {
          return;
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `目标文件夹 ${chalk.cyan(targetDir)} 已经存在，请选择：`,
            choices: [
              { name: '覆盖', value: 'overwrite' },
              { name: '取消', value: false },
            ],
          },
        ]);
        if (!action) {
          return;
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
          await fs.remove(targetDir);
        }
      }
    }
  }
  await clearConsole();

  // 前面完成准备工作，正式开始创建项目
  const creator = new Creator(name, targetDir);
  // await creator.create(options);
};

export default (...args: any) => {
  return create(...args);
};
