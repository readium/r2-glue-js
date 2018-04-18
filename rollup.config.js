import typescript2 from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'iife',
      name: 'ReadiumGlue',
      sourcemap: true,
      globals: {}
    }
  ],
  external: [],
  plugins: [
    resolve(),
    commonjs(),
    typescript2()
  ]
};