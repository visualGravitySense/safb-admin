# Исправление экспорта для Vercel - использование handler функции

## ❌ Проблема

API возвращает 404 NOT_FOUND, JSON не возвращается.

## 🔍 Причина

Vercel требует экспорт handler функции `(req, res) => {}`, а не Express app напрямую.

## ✅ Решение

### Изменен экспорт в `api/index.js`

**До:**
```javascript
export default app
```

**После:**
```javascript
export default (req, res) => {
  // Remove /api prefix if present
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '') || '/'
  }
  if (req.path && req.path.startsWith('/api')) {
    req.path = req.path.replace('/api', '') || '/'
  }
  return app(req, res)
}
```

### Упрощен middleware

Удален middleware для удаления `/api` префикса, так как это теперь делается в handler функции.

## 🚀 Как это работает

1. Запрос: `https://safb-admin.vercel.app/api/health`
2. Vercel автоматически роутит в `api/index.js`
3. Handler функция получает запрос с путем `/api/health`
4. Handler убирает префикс `/api` → путь становится `/health`
5. Handler передает запрос в Express app
6. Express находит роут `app.get('/health')` и отвечает JSON

## 📝 Следующие шаги

1. **Запушьте изменения:**
   ```bash
   cd dashboard
   git add api/index.js vercel.json
   git commit -m "Fix API: use handler function instead of direct app export"
   git push
   ```

2. **Проверьте API после деплоя:**
   ```bash
   curl https://safb-admin.vercel.app/api/health
   ```

   Должен вернуться JSON:
   ```json
   {
     "success": true,
     "message": "API is running",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "environment": "vercel"
   }
   ```

## 💡 Почему это важно

- Vercel serverless functions требуют экспорт функции `(req, res) => {}`
- Экспорт Express app напрямую может не работать правильно
- Handler функция позволяет обработать запрос перед передачей в Express

## ✅ Готово!

После этого исправления API должен работать и возвращать JSON ответы.
