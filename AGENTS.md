# LIBLANKA-FE KNOWLEDGE BASE

## OVERVIEW

React 18 CRA + TypeScript (strict mode). MUI v6 + Tailwind CSS + Bootstrap 5 (все три активны). i18next. Axios API client. Redux reducers + React Contexts. React Router v6.

## STRUCTURE

```
src/
├── api/                # Axios-клиенты к BE (context-path /api/v1/)
├── components/         # Переиспользуемые UI компоненты
│   └── ui/
├── contexts/           # React Context providers
├── dto/                # TypeScript типы/интерфейсы (зеркало BE DTOs)
├── hooks/              # Custom React hooks
├── locales/            # i18n переводы (i18next)
├── pages/
│   ├── admin/          # Admin product management
│   ├── home/           # Landing page + sections
│   ├── login/          # Аутентификация
│   └── products/       # Каталог + детали товаров
│       └── components/
├── reducers/           # Redux-style reducers
├── routes/             # React Router v6 route definitions
├── utils/
│   ├── cookie/         # Cookie helpers (JWT хранение)
│   └── utils.ts
├── App.tsx             # Root компонент + провайдеры
├── Constants.ts        # Глобальные константы (API URLs и т.д.)
└── index.tsx           # Entry point
```

## STYLING SYSTEM

Три CSS-фреймворка сосуществуют — использовать в следующем порядке приоритета:

1. **Tailwind** (`important: true` — все классы с `!important`) — утилиты, spacing, layout
2. **MUI v6** (`@emotion/react`) — компоненты (Button, TextField, Dialog и т.д.)
3. **Bootstrap 5** + `react-bootstrap` — только где уже используется (не добавлять в новый код)

### Кастомные цвета (Tailwind)

```
primary:    #FFEDDB   (светло-бежевый)
secondary:  #EDCDBB
tertiary:   #E3B7A0
quaternary: #BF9270   (коричневый)
```

### Кастомные шрифты (Tailwind)

- `font-rounded` — M PLUS Rounded 1c (основной)
- `font-comfortaa` — Comfortaa
- `font-pacifico` — Pacifico (акцент)
- `font-roboto` — Roboto

## WHERE TO LOOK

| Task                 | Location                                    |
| -------------------- | ------------------------------------------- |
| Добавить страницу    | `src/pages/`, добавить роут в `src/routes/` |
| API вызов            | `src/api/`, типы в `src/dto/`               |
| Добавить перевод     | `src/locales/`                              |
| Глобальное состояние | `src/contexts/` или `src/reducers/`         |
| Новый хук            | `src/hooks/`                                |
| JWT/cookie           | `src/utils/cookie/`                         |
| Константы            | `src/Constants.ts`                          |

## CONVENTIONS

- TypeScript `strict: true` — no `any`, no `@ts-ignore`
- `module: "node16"` + `moduleResolution: "node16"` — явные расширения при импортах если нужно
- DTOs в `src/dto/` — отдельный файл per BE entity, именование совпадает с BE
- Локализация обязательна для всего user-facing текста (не хардкодить строки)
- Cookie для JWT (не localStorage) — `src/utils/cookie/`
- API base URL через `Constants.ts`, не хардкодить

## ANTI-PATTERNS

- Не добавлять новые Bootstrap компоненты — использовать MUI или Tailwind
- Не хардкодить строки — только через i18next
- Не хранить JWT в localStorage — только cookies
- Не дублировать типы — один файл в `src/dto/` per сущность

## COMMANDS

```bash
npm start          # dev сервер (CRA)
npm run build      # production build
npm test           # Jest + React Testing Library
```

## NOTES

- Tailwind `important: true` — все Tailwind-классы переопределяют MUI стили (это намеренно)
- CRA (react-scripts) — нет vite/webpack конфига, eject не делать без необходимости
- `framer-motion` используется для анимаций
- `react-helmet-async` для `<head>` management
