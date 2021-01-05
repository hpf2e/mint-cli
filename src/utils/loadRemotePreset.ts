import fs from 'fs-extra';
import os from 'os';
import path from 'path';
// @ts-ignore
const download = require('download-git-repo');

const remotePresetMap = {
  redux: 'Walker-Leee/react-temp-mobx',
  mobx: 'Walker-Leee/react-temp-mobx',
};

export default async function (
  name: string,
  targetDir: string,
  clone: boolean,
) {
  const tmpdir = path.join(os.tmpdir(), 'mint-cli');

  // clone will fail if tmpdir already exists
  // https://github.com/flipxfx/download-git-repo/issues/41
  // if (clone) {
  //   await fs.remove(tmpdir)
  // }

  await fs.remove(tmpdir);

  await new Promise((resolve, reject) => {
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    // @ts-ignore
    download(remotePresetMap[name], tmpdir, { clone }, (err: Error) => {
      if (err) return reject(err);
      resolve('');
    });
  });

  return {
    targetDir,
    tmpdir,
  };
}
