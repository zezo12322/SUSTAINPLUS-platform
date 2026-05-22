import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // NextAuth and Prisma adapter require `any` for type augmentation
      '@typescript-eslint/no-explicit-any': 'warn',
      // Dynamic require() is used in a few intentional places
      '@typescript-eslint/no-require-imports': 'warn',
      // Unused vars can remain as warnings
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]

export default config
