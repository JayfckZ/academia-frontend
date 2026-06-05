import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import reactHooks from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier' 

export default defineConfig([
  ...nextCoreVitals,
  ...nextTypescript,

  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },

  prettierConfig,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'dist/**', 'next-env.d.ts']),
])
