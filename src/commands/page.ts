import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import PageCreator from './PageCreator';
import validFileName from 'valid-filename';
import { error, clearConsole } from '../utils/common/logger';
import { stopSpinner } from '../utils/common/spinner';
import exit from '../utils/common/exit';

/**
 * 创建项目
 * @param {*} pageName
 * @param {*} options
 */
async function create(pageName = '', options?: any) {
  // 检测文件名是否合规
  const result = validFileName(pageName);
  // 如果所输入的不是合法npm包名，则退出
  if (!result) {
    console.error(chalk.red(`不合法的文件名: "${pageName}"`));
    exit(1);
  }

  const cwd = options.cwd || process.cwd();
  const pagePath = path.resolve(
    cwd,
    './src/pages',
    pageName.charAt(0).toUpperCase() + pageName.slice(1).toLowerCase(),
  );
  const pkgJsonFile = path.resolve(cwd, 'package.json');

  // 如果不存在package.json，说明不再根目录，不能创建
  if (!fs.existsSync(pkgJsonFile)) {
    console.error(
      chalk.red('\n' + '⚠️  请确认您是否在项目根目录下运行此命令\n'),
    );
    return;
  }

  // 如果page已经存在，询问覆盖还是取消
  if (fs.existsSync(pagePath)) {
    if (options.force) {
      await fs.remove(pagePath);
    } else {
      await clearConsole();
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `已存在 ${chalk.cyan(pageName)} 页面，请选择：`,
          choices: [
            { name: '覆盖', value: true },
            { name: '取消', value: false },
          ],
        },
      ]);
      if (!action) {
        return;
      } else {
        console.log(`\nRemoving ${chalk.cyan(pagePath)}...`);
        await fs.remove(pagePath);
      }
    }
  }

  // 前面完成准备工作，正式开始创建页面
  const pageCreator = new PageCreator(pageName, pagePath);
  await pageCreator.create(options);
}

export default (...args: any) => {
  return create(...args).catch((err) => {
    stopSpinner(false);
    error(err);
  });
};
