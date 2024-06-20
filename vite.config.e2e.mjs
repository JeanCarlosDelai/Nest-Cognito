/* eslint-disable prettier/prettier */
import dotenv from 'dotenv';
import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

dotenv.config();

export const userConfig = {
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
  },
}

export default defineConfig(userConfig)
