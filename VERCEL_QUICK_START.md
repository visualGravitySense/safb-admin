# Быстрый старт: Деплой API на Vercel

## 🚀 Быстрая инструкция

### 1. Деплой API на Vercel

#### Вариант A: Через веб-интерфейс (рекомендуется)

1. Зайдите на [vercel.com](https://vercel.com) и войдите
2. Нажмите **"Add New Project"**
3. Импортируйте ваш Git репозиторий
4. Настройки:
   - **Root Directory**: `dashboard`
   - **Framework Preset**: Other
   - Остальное оставьте по умолчанию
5. Нажмите **"Deploy"**
6. Скопируйте URL вашего проекта (например: `https://your-project.vercel.app`)

#### Вариант B: Через CLI

```bash
cd dashboard
npm install -g vercel
vercel login
vercel
vercel --prod  # для production
```

### 2. Настройка Dashboard

После деплоя получите URL вашего API и обновите конфигурацию:

#### Создайте файл `.env.production` в папке `dashboard`:

```env
VITE_API_URL=https://your-project.vercel.app/api
```

Замените `your-project.vercel.app` на ваш реальный Vercel URL.

### 3. Проверка работы

```bash
# Проверьте health endpoint
curl https://your-project.vercel.app/api/health
```

Должен вернуться:
```json
{
  "success": true,
  "message": "API is running",
  "environment": "vercel"
}
```

### 4. Деплой Dashboard на GitHub Pages

После настройки API URL, деплойте dashboard как обычно:

```bash
npm run build:gh-pages
# Затем следуйте инструкциям в QUICK_DEPLOY.md
```

## ⚠️ Важно: Хранение данных

**Текущая реализация использует временное хранилище `/tmp`**, которое **не сохраняет данные** между вызовами функций.

### Для production рекомендуется:

1. **Vercel Blob Storage** - для файлов изображений
2. **База данных** (MongoDB Atlas, Supabase) - для контента
3. **Vercel KV** - для простых JSON данных

См. [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) для подробной информации.

## 📝 Структура

```
dashboard/
├── api/
│   └── index.js          # Vercel serverless function
├── server/
│   └── index.js          # Локальный сервер (dev)
├── vercel.json           # Конфигурация Vercel
└── .env.production       # Production переменные
```

## 🔗 Полезные ссылки

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - подробная инструкция
