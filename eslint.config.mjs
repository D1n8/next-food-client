// 1. Недостающие импорты
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

// 2. Импорты для совместимости старого конфига Next.js с новым ESLint
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// Эмуляция __dirname для ESM модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаем "переходник" для старых конфигов
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Игнорируемые файлы
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  
  // Базовые правила
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Правильно подключаем Next.js конфиг через FlatCompat
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Ваши кастомные настройки
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    // 4. Указываем линтеру, где искать алиасы
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  }
];