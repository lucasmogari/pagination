import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'newPackage',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Externalize dependencies here if needed, e.g. ['react']
      external: [],
      output: {
        exports: 'named',
      },
    },
  },
  esbuild: {
    pure: ['console.warn'],
  },
});
