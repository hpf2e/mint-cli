import chalk from 'chalk';
import EventEmitter from 'events';
import fs from 'fs-extra';
import generatePage from '../utils/generatePage';
import {logWithSpinner, stopSpinner} from '../utils/common/spinner';
import {
  log,
  clearConsole,
} from '../utils/common/logger';

export default class PageCreator extends EventEmitter {
	name: string;
	context: string;
	
  constructor(name: string, context: string) {
    super();

    this.name = name;
    this.context = context;
  }

  async create(cliOptions = {}) {
    const fileNameObj = this.getName();
    const { context } = this;
    await clearConsole();
    log(
      chalk.blue.bold(
        `Awesome-test CLI v${require('../package.json').version}`,
      ),
    );
    logWithSpinner(`✨`, `正在创建页面...`);
    // 创建文件夹
    await fs.mkdir(context, { recursive: true });
    this.emit('creation', { event: 'creating' });

    stopSpinner();

    console.log(context);
    await generatePage(context, fileNameObj);
  }

  getName() {
    const originName = this.name;
    const tailName = originName.slice(1);
    const upperName = originName.charAt(0).toUpperCase() + tailName;
    const lowerName = originName.charAt(0).toLowerCase() + tailName;
    return {
      upperName,
      lowerName,
    };
  }
}
