# Деплой API на Vercel

Это руководство поможет вам развернуть API сервер на Vercel, пока dashboard и основной сайт будут на GitHub Pages.

## Предварительные требования

1. Аккаунт на [Vercel](https://vercel.com)
2. Установленный [Vercel CLI](https://vercel.com/docs/cli) (опционально, можно деплоить через веб-интерфейс)
3. Git репозиторий с вашим кодом

## Структура проекта

```
dashboard/
├── api/
│   └── index.js          # Vercel serverless function
├── server/
│   └── index.js          # Локальный сервер (для разработки)
├── vercel.json           # Конфигурация Vercel
└── ...
```

## Шаг 1: Подготовка проекта

Убедитесь, что у вас есть:
- ✅ `api/index.js` - серверная функция для Vercel
- ✅ `vercel.json` - конфигурация Vercel
- ✅ Все зависимости в `package.json`

## Шаг 2: Деплой через Vercel CLI

### Установка Vercel CLI

```bash
npm install -g vercel
```

### Вход в Vercel

```bash
vercel login
```

### Деплой

Перейдите в папку `dashboard`:

```bash
cd dashboard
vercel
```

Следуйте инструкциям:
1. Выберите существующий проект или создайте новый
2. Подтвердите настройки
3. Дождитесь завершения деплоя

### Production деплой

```bash
vercel --prod
```

## Шаг 3: Деплой через веб-интерфейс

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш Git репозиторий
4. Настройки проекта:
   - **Root Directory**: `dashboard` (если репозиторий содержит несколько проектов)
   - **Framework Preset**: Other
   - **Build Command**: (оставьте пустым или `npm install`)
   - **Output Directory**: (оставьте пустым)
5. Нажмите "Deploy"

## Шаг 4: Настройка переменных окружения

После деплоя получите URL вашего API (например: `https://your-project.vercel.app`)

### В Vercel Dashboard:
1. Перейдите в Settings → Environment Variables
2. Добавьте переменные (если нужны):
   - `NODE_ENV=production`
   - `VERCEL_URL` (устанавливается автоматически)

## Шаг 5: Обновление Dashboard для использования Vercel API

Обновите переменную окружения в вашем dashboard:

### Создайте `.env.production` в папке `dashboard`:

```env
VITE_API_URL=https://your-project.vercel.app/api
```

Замените `your-project.vercel.app` на ваш реальный Vercel URL.

### Или обновите `vite.config.js`:

```js
export default defineConfig({
  // ...
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://your-project.vercel.app/api')
  }
})
```

## Шаг 6: Проверка работы API

После деплоя проверьте работу API:

```bash
curl https://your-project.vercel.app/api/health
```

Должен вернуться ответ:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "vercel"
}
```

## Важные замечания

### ⚠️ Хранение данных

**Важно:** Vercel serverless functions используют `/tmp` директорию для временных файлов, которые **не сохраняются** между вызовами функций.

**Рекомендации:**
1. **Для production:** Используйте внешнее хранилище:
   - [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) (рекомендуется)
   - [Cloudinary](https://cloudinary.com) для изображений
   - [AWS S3](https://aws.amazon.com/s3/) или аналоги
   - База данных (MongoDB, PostgreSQL, etc.) для контента

2. **Для разработки:** Текущая реализация работает, но данные могут теряться при перезапуске функций.

### 📁 Файлы изображений

Текущая реализация сохраняет файлы в `/tmp`, что означает:
- Файлы доступны только во время выполнения функции
- Файлы удаляются после завершения функции
- Для production нужна интеграция с внешним хранилищем

### 🔄 Обновление данных

Данные в `/tmp/data/content.json` могут теряться. Для production рекомендуется:
- Использовать базу данных (MongoDB Atlas, Supabase, etc.)
- Или использовать Vercel KV для хранения JSON

## Интеграция с Vercel Blob Storage (рекомендуется)

Для production использования файлового хранилища:

1. Установите `@vercel/blob`:
```bash
npm install @vercel/blob
```

2. Обновите `api/index.js` для использования Blob Storage (см. документацию Vercel)

## Интеграция с базой данных

Для постоянного хранения контента рекомендуется использовать базу данных:

### Варианты:
- **MongoDB Atlas** (бесплатный tier доступен)
- **Supabase** (PostgreSQL, бесплатный tier)
- **PlanetScale** (MySQL, бесплатный tier)
- **Vercel KV** (Redis, для простых данных)

## Troubleshooting

### Проблема: API возвращает 404

**Решение:** Убедитесь, что:
- Файл `api/index.js` существует
- `vercel.json` правильно настроен
- Роуты начинаются с `/api/`

### Проблема: Файлы не сохраняются

**Решение:** Это ожидаемое поведение на Vercel. Используйте внешнее хранилище (см. выше).

### Проблема: CORS ошибки

**Решение:** CORS уже настроен в коде. Если проблемы остаются, проверьте:
- Правильность URL в dashboard
- Настройки CORS в `api/index.js`

## Следующие шаги

1. ✅ Деплой API на Vercel
2. ⏳ Настройка внешнего хранилища для файлов
3. ⏳ Настройка базы данных для контента
4. ⏳ Обновление dashboard для использования Vercel API URL
5. ⏳ Тестирование интеграции

## Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
