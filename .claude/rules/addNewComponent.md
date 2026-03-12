# Правила создания нового компонента

## Структура файлов

Каждый компонент — отдельная папка в `src/shared/components/`:

```
src/shared/components/MyComponent/
  MyComponent.tsx           # Основной файл компонента
  MyComponent.module.scss   # Стили (если нужны)
  index.ts                  # Реэкспорт
```

Подкомпоненты размещаются в:
```
src/shared/components/MyComponent/components/SubComponent/
  SubComponent.tsx
  SubComponent.module.scss
  index.ts
```

---

## index.ts

Всегда только реэкспорт дефолтного экспорта:

```ts
export { default } from './MyComponent'
```

Если компонент экспортирует именованные типы — добавить:
```ts
export type { MyComponentProps } from './MyComponent'
```

---

## ComponentName.tsx — шаблоны

### Простой презентационный компонент (без стора, без MobX)

```tsx
'use client'
import React, { memo } from 'react';
import styles from './MyComponent.module.scss';
import classNames from 'classnames';

export type MyComponentProps = {
  className?: string;
  // ...остальные пропсы
};

const MyComponent: React.FC<MyComponentProps> = ({ className, ...props }) => {
  return (
    <div className={classNames(styles.root, className)}>
      {/* содержимое */}
    </div>
  );
};

export default memo(MyComponent);
```

### Интерактивный компонент с локальным состоянием (без MobX)

```tsx
'use client'
import { useState, useCallback } from 'react';
import styles from './MyComponent.module.scss';

function MyComponent() {
  const [value, setValue] = useState('');

  const handleChange = useCallback(() => {
    // ...
  }, []);

  return <div className={styles.root}>{/* содержимое */}</div>;
}

export default MyComponent;
```

### Observer-компонент с локальным MobX-стором

```tsx
'use client'
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import MyStore from '@shared/store/MyStore';
import styles from './MyComponent.module.scss';

const MyComponent = observer(() => {
  const [store] = useState(() => new MyStore());

  useEffect(() => {
    store.fetchData();
  }, [store]);

  return <div className={styles.root}>{/* содержимое */}</div>;
});

export default MyComponent;
```

### Observer-компонент с глобальным MobX-стором

```tsx
'use client'
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/shared/store/RootStore';
import styles from './MyComponent.module.scss';

const MyComponent = observer(() => {
  const { userStore } = useRootStore();

  return <div className={styles.root}>{/* содержимое */}</div>;
});

export default MyComponent;
```

---

## Ключевые правила

### `'use client'`
Обязателен в **любом** интерактивном компоненте: использует хуки, обработчики событий, MobX observer, `useState`, `useEffect`.

### `memo()` vs `observer()`
- Нет MobX → оборачивать в `memo()`
- Читает MobX-стор → оборачивать в `observer()` (memo не нужен, observer его включает)
- Оба сразу — не использовать

### Типы пропсов
- Объявлять в том же файле через `export type`
- Всегда включать `className?: string` для компонентов, которые могут встраиваться в другие

### Стили
- Только SCSS Modules: `import styles from './MyComponent.module.scss'`
- Комбинирование классов — только через `classNames()` из пакета `classnames`
- CSS-переменные для цветов: использовать как `var(--color-primary)`, значения переменных брать из @/shared/styles/index.scss
- Адаптив через миксин: `@include respond(lg)`, `@include respond(md)`, `@include respond(sm)`

### Импорты
Использовать алиасы, не относительные пути:
```ts
import Button from '@components/Button'           // src/shared/components/
import { routes } from '@/shared/config/routes'   // src/shared/config/
import { Meta } from '@shared/types/shared'       // src/shared/
```

### Роутинг
Никогда не хардкодить строки путей. Только:
```ts
import { routes } from '@/shared/config/routes'
href={routes.main.mask}
href={routes.recipe.create(id)}
```

### Локальный MobX-стор
Создавать через `useState` (не через `useMemo`):
```ts
const [store] = useState(() => new MyStore())
```

### `useSearchParams`
Если компонент использует `useSearchParams` — страница, где он используется, должна оборачивать его в `<Suspense>`.

### Комментирование
Избегай избыточного комментирования файлов, только самое важное (если понадобится). Файлы по стилями не комментируй.

---

## Чеклист перед созданием

- [ ] Папка с именем в PascalCase создана в `src/shared/components/`
- [ ] `index.ts` с реэкспортом создан
- [ ] `'use client'` стоит первой строкой (если компонент интерактивный)
- [ ] Тип пропсов объявлен и экспортирован (`export type`)
- [ ] `className?: string` добавлен в пропсы (если компонент может быть переиспользован)
- [ ] Импорты используют алиасы (`@components/`, `@shared/`, `@/`)
- [ ] Стили через SCSS Module + `classNames()`
- [ ] `memo()` или `observer()` применён корректно
- [ ] Пути/роуты через `routes` из конфига
