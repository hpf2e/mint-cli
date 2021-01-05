import fs from 'fs-extra';
import path from 'path';

export default async function copyFile (temp: string, target: string) {
  await fs.copy(temp, target)
  await fs.remove(path.resolve(target, './.git'))
  const pkgJson = await fs.readJson(target+'/package.json')
  return pkgJson
}
