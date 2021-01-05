const descriptions: any = {
  start: '启动项目',
  build: '打包生成线上项目',
};

type PkgProps = {
  name?: string;
  scripts?: string;
};

function printScripts(pkg: PkgProps, packageManager: string) {
  return Object.keys(pkg.scripts || {})
    .map((key) => {
      if (!descriptions[key]) return '';
      return [
        `\n### ${descriptions[key]}`,
        '```',
        `${packageManager} run ${key}`,
        '```',
        '',
      ].join('\n');
    })
    .join('');
}

export default function generateReadme(pkg: PkgProps, packageManager: string) {
  return [
    `# ${pkg.name}\n`,
    '## Project setup',
    '```',
    `${packageManager} install`,
    '```',
    printScripts(pkg, packageManager),
    '### Customize configuration',
    '',
  ].join('\n');
}
