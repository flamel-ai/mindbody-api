import cleanup from 'rollup-plugin-cleanup';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.ts',
    external: ['axios', 'p-limit'],
    output: [
      {
        file: 'dist/esm/index.mjs',
        format: 'esm',
        generatedCode: {
          constBindings: true,
        },
        exports: 'named',
      },
      {
        file: 'dist/cjs/index.cjs',
        format: 'cjs',
        exports: 'named',
        interop: 'auto', // Add this
      },
    ],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      commonjs({
        include: /node_modules/,
      }),
      typescript(),
      cleanup({
        comments: 'none',
        extensions: '.ts',
      }),
    ],
  },
  {
    input: 'src/index.ts',
    external: ['axios', 'p-limit'],
    output: [
      {
        file: 'dist/types.d.ts',
        format: 'es',
      },
    ],
    plugins: [typescript(), dts()],
  },
];