import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import { error } from './common/logger';
import { logWithSpinner, stopSpinner } from './common/spinner';

const tempPath = path.resolve(__dirname, '../../temp');
const pageTempPath = path.resolve(tempPath, 'page.js');
const lessTempPath = path.resolve(tempPath, 'page.less');
const ioTempPath = path.resolve(tempPath, 'io.js');
const storeTempPath = path.resolve(tempPath, 'store.js');

async function generatePage(
  context: string,
  {
    lowerName,
    upperName,
  }: {
    lowerName: string;
    upperName: string;
  },
) {
  logWithSpinner(`生成 ${chalk.yellow(`${upperName}/${upperName}.js`)}`);
  const ioTemp = await fs.readFile(pageTempPath);
  const ioContent = nunjucks.renderString(ioTemp.toString(), {
    lowerName,
    upperName,
  });
  await fs.writeFile(path.resolve(context, `./${upperName}.js`), ioContent, {
    flag: 'a',
  });
  stopSpinner();
}

async function generateLess(
  context: string,
  {
    lowerName,
    upperName,
  }: {
    lowerName: string;
    upperName: string;
  },
) {
  logWithSpinner(`生成 ${chalk.yellow(`${upperName}/${upperName}.less`)}`);
  const ioTemp = await fs.readFile(lessTempPath);
  const ioContent = nunjucks.renderString(ioTemp.toString(), {
    lowerName,
    upperName,
  });
  await fs.writeFile(path.resolve(context, `./${upperName}.less`), ioContent, {
    flag: 'a',
  });
  stopSpinner();
}

async function generateIo(
  context: string,
  {
    lowerName,
    upperName,
  }: {
    lowerName: string;
    upperName: string;
  },
) {
  logWithSpinner(`生成 ${chalk.yellow(`${upperName}/io.js`)}`);
  const ioTemp = await fs.readFile(ioTempPath);
  const ioContent = nunjucks.renderString(ioTemp.toString(), {
    lowerName,
    upperName,
  });
  await fs.writeFile(path.resolve(context, `./io.js`), ioContent, {
    flag: 'a',
  });
  stopSpinner();
}

async function generateStore(
  context: string,
  {
    lowerName,
    upperName,
  }: {
    lowerName: string;
    upperName: string;
  },
) {
  logWithSpinner(`生成 ${chalk.yellow(`${upperName}/store-${lowerName}.js`)}`);
  const ioTemp = await fs.readFile(storeTempPath);
  const ioContent = nunjucks.renderString(ioTemp.toString(), {
    lowerName,
    upperName,
  });
  await fs.writeFile(
    path.resolve(context, `./store-${lowerName}.js`),
    ioContent,
    { flag: 'a' },
  );
  stopSpinner();
}

export default (
  context: string,
  nameObj: {
    lowerName: string;
    upperName: string;
  },
) => {
  Promise.all([
    generateIo(context, nameObj),
    generatePage(context, nameObj),
    generateStore(context, nameObj),
    generateLess(context, nameObj),
  ]).catch((err) => {
    stopSpinner(false);
    error(err);
  });
};
