import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  ...nextCoreVitals,
  ...nextTypescript,

  {
    plugins: {
      'react-hooks': reactHooks,
      prettier
    },

    rules: {
      ...reactHooks.configs.recommended.rules,

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'none',
          tabWidth: 2
        }
      ],

      '@typescript-eslint/no-unused-vars': 'off'
    }
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'dist/**', 'next-env.d.ts']),

  prettierConfig
])
