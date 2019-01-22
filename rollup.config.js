
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

const plugins = [
  resolve(),
  commonjs(),
]

export default [
  {
    input: 'src/embed.js',
    output: {
      name: 'ReadiumGlue',
      file: './dist/glue-embed.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'src/caller.js',
    output: {
      name: 'ReadiumGlue',
      file: './dist/glue-caller.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
];
