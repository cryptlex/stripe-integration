/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    test: {},
    resolve: {
        alias: {
          '@shared-utils': path.resolve(__dirname, 'utils')
        }
      }
})