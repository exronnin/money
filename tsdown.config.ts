import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['src/money.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist',
    dts: true,
    sourcemap: false,
    minify: true,
    treeshake: true,
    exports: true,
    clean: true,
    outputOptions: {
        legalComments: 'inline'
    }
}) 