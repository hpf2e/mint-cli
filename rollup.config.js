import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import eslint from '@rollup/plugin-eslint'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import pkg from './package.json'

const paths = {
  input: path.join(__dirname, '/src/index.ts'),
  output: path.join(__dirname, '/lib'),
}

const rollupConfig = {
  input: paths.input, // 打包入口
  output: [ // 打包出口
    {
      file: path.join(paths.output, 'index.js'),  // 引出的方式为umd的方式
      format: 'cjs',
      name: pkg.name,
    },
  ],
  // external: ['lodash'], // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
  plugins: [
    // 验证导入的文件
    eslint({
      throwOnError: true, // lint 结果有错误将会抛出异常
      throwOnWarning: false,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'lib/**', '*.js'],
		}),
		typescript(),
		json(),
    babel({
			babelHelpers: 'runtime',
			plugins: [
				'@babel/plugin-transform-runtime'
			],
			// skipPreflightCheck: true,
      // 只转换源代码，不运行外部依赖
      // exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [
        ...DEFAULT_EXTENSIONS,
        '.ts',
      ],
    }),
		// 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
		commonjs(),
    // 配合 commnjs 解析第三方模块
    nodeResolve({
			preferBuiltins: true
      // // 将自定义选项传递给解析插件
      // customResolveOptions: {
      //   moduleDirectory: 'node_modules',
      // },
		}),
  ],
}

export default rollupConfig
