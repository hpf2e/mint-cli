import chalk from 'chalk';
// @ts-ignore
import importGlobal from 'import-global';
import { hasYarn, hasPnpm3OrLater } from '../utils/common/env';

export default function loadCommand(commandName: string, moduleName: string) {
  // const isNotFoundError = (err: Error) => {
  //   return err.message.match(/Cannot find module/);
  // };
  // try {
  //   return import(moduleName);
  // } catch (err) {
  //   if (isNotFoundError(err)) {
  //     try {
  //       return importGlobal(moduleName);
  //     } catch (err2) {
  //       if (isNotFoundError(err2)) {
  //         let installCommand = `npm install -g`;
  //         if (hasYarn()) {
  //           installCommand = `yarn global add`;
  //         } else if (hasPnpm3OrLater()) {
  //           installCommand = `pnpm install -g`;
  //         }
  //         console.log();
  //         console.log(
  //           `  命令 ${chalk.cyan(`mint ${commandName}`)} 依赖一些全局的插件\n` +
  //             `  请执行 ${chalk.cyan(
  //               `${installCommand} ${moduleName}`,
  //             )} 后重试`,
  //         );
  //         console.log();
  //         process.exit(1);
  //       } else {
  //         throw err2;
  //       }
  //     }
  //   } else {
  //     throw err;
  //   }
  // }
}
