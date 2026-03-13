# CLAUDE.md

Этот файл содержит инструкции для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Команды

```bash
yarn dev      # Запустить сервер разработки
```

Тест-раннер в проекте не настроен.

## Архитектура

### Технологический стек
- **Next.js 16** (App Router) + **React 19**
- **MobX 6** + **mobx-react-lite** — управление состоянием
- **TypeScript** в строгом режиме
- **SCSS Modules** — стилизация компонентов
- **Axios** + **qs** — API-запросы
- **Sass** — глобальные стили

### API
Все запросы направляются на `https://front-school-strapi.ktsdev.ru/api` (задано в [src/shared/consts.ts](src/shared/consts.ts)). Бэкенд — Strapi CMS. Авторизация через JWT, хранится в `localStorage` под ключом `'jwt'` JWT токен представляет из себя access токен-строку с достаточно большим временем жизни. Refresh токен не предусмотрен.

### Структура App Router
```
src/app/
  layout.tsx              # Корневой layout — оборачивает всё в RootStoreProvider + Header
  page.tsx                # / → Список рецептов с бесконечной прокруткой, поиском, фильтрами
  recipe/[id]/page.tsx    # /recipe/:id → Детальная страница рецепта
  (auth)/login/           # /login - страница логина пользователя 
  (auth)/register/        # /register - страница регистрации пользователя
  (protected)/layout.tsx  # Auth guard — редирект на /login если не авторизован
  (protected)/favorites/  # /favorites — требует авторизации. Страница с избранными рецептами пользователя
  (protected)/profile/    # /profile — требует авторизации. Страница профиль пользователя
```

### Управление состоянием
MobX-сторы находятся в `src/shared/store/`. Два вида:

**Глобальные (в RootStore)** — создаются один раз, доступны через хук `useRootStore()`:
- `UserStore` — состояние авторизации, login/register/logout, управление JWT
- `UIStore` — переключение светлой/тёмной темы, сохраняется в `localStorage`

**Локальные (на страницу)** — создаются через `useState(() => new Store())` внутри компонентов:
- `RecipeListStore` — постраничный список рецептов с поиском/фильтрацией/сортировкой
- `RecipeStore` — детали одного рецепта
- `FavoritesStore` — избранные рецепты пользователя (CRUD через API)
- `CategoryStore` — варианты для дропдауна категорий

Все сторы используют `makeObservable` с явными декораторами (кроме `UIStore`, который использует `makeAutoObservable`). Мутации состояния внутри async-методов должны быть обёрнуты в `runInAction`. Enum `Meta` (`initial | loading | error | success`) из [src/shared/types/shared.ts](src/shared/types/shared.ts) отслеживает состояние асинхронных операций.

`enableStaticRendering(typeof window === 'undefined')` вызывается в [RootStore.tsx](src/shared/store/RootStore/RootStore.tsx) для предотвращения MobX-подписок при SSR.

### Алиасы путей (tsconfig.json)
```
@/*          → src/*
@shared/*    → src/shared/*
@components/* → src/shared/components/*
@styles/*    → src/shared/styles/*
@config/*    → src/shared/config/*
```

### Соглашения по компонентам
- Каждый компонент имеет собственную папку с `ComponentName.tsx`, `ComponentName.module.scss` и `index.ts` (реэкспорт)
- Observer-компоненты используют `observer()` из `mobx-react-lite`
- Директива `'use client'` используется во всех интерактивных компонентах и страницах
- Страницы, использующие `useSearchParams`, оборачиваются в `<Suspense>` во избежание ошибок сборки Next.js

### Модели данных
API возвращает `ingradients` (опечатка в API). Функции `normalizeRecipe` / `normalizeFullRecipe` в [src/shared/store/models/recipe.ts](src/shared/store/models/recipe.ts) преобразуют `ingradients` → `ingredients` при получении данных.

### Роутинг
Все маршруты определены как объекты с `mask` и `create()` в [src/shared/config/routes.ts](src/shared/config/routes.ts). Всегда используй их вместо захардкоженных строк.

### Тема
Тёмная/светлая тема применяется через атрибут `data-theme` на `<body>`. Инлайн-скрипт в корневом layout читает значение из `localStorage` до гидратации, чтобы избежать мигания. CSS-переменные тем находятся в глобальных SCSS-стилях.

## Code Style Guidelines
- **Использование компонентов**: По возможности используй готовые ui компоненты из @/shared/components, и при необходимости изменяй стили поверх компонентов.
- **TypeScript**: Обязательная типизация пропсов и стейта. Избегать `any`.
- **Naming**: Сторы называются `NameStore.ts`, хуки `useName.ts`.
- **Комментирование**: Избегай избыточного комментирования, только самое важное (если нужно). Файлы со стилями не комменируй.