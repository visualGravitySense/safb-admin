# Исправление роутинга API на Vercel

## ❌ Проблема

API не работает - ошибка "Cannot GET /api/health"

## 🔍 Причина

Vercel автоматически роутит файлы из папки `api/` по пути `/api/*`, но Express получает полный путь `/api/health`, а роуты определены как `/health` (без префикса).

## ✅ Решение

### 1. Добавлен middleware для удаления префикса `/api`

В `api/index.js` добавлен middleware, который убирает префикс `/api` из пути:

```javascript
// Remove /api prefix from requests (Vercel adds it automatically)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    req.url = req.url.replace('/api', '') || '/'
  }
  next()
})
```

### 2. Упрощен vercel.json

Удален явный роутинг из `vercel.json`, так как Vercel автоматически роутит файлы из `api/`:

**До:**
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

**После:**
```json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  }
}
```

## 🚀 Как это работает

1. Запрос приходит: `https://safb-admin.vercel.app/api/health`
2. Vercel автоматически роутит его в `api/index.js` (по умолчанию для файлов в `api/`)
3. Express получает путь `/api/health`
4. Middleware убирает префикс `/api` → путь становится `/health`
5. Express находит роут `app.get('/health')` и отвечает

## 📝 Следующие шаги

1. **Запушьте изменения:**
   ```bash
   cd dashboard
   git add api/index.js vercel.json
   git commit -m "Fix API routing: add middleware to remove /api prefix"
   git push
   ```

2. **Проверьте API после деплоя:**
   ```bash
   curl https://safb-admin.vercel.app/api/health
   ```

   Должен вернуться:
   ```json
   {
     "success": true,
     "message": "API is running",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "environment": "vercel"
   }
   ```

## ✅ Проверка других endpoints

После исправления должны работать:
- ✅ `GET /api/health` - health check
- ✅ `GET /api/content` - получить весь контент
- ✅ `GET /api/content/hero` - получить секцию
- ✅ `PUT /api/content/:section` - обновить секцию
- ✅ `POST /api/upload` - загрузить файл

## 💡 Почему это работает

- Vercel автоматически роутит файлы из `api/` по пути `/api/*`
- Не нужно явно указывать роутинг в `vercel.json` для стандартной структуры
- Middleware в Express убирает префикс `/api`, чтобы роуты работали правильно

## ✅ Готово!

После этого исправления API должен работать корректно.
