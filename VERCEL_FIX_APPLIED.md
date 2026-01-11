# Исправление применено - что делать дальше

## ✅ Что было исправлено

1. **Убран префикс `/api` из Express роутов** - Vercel уже добавляет его через `vercel.json`
2. **Исправлен экспорт** - теперь экспортируется Express app напрямую
3. **Упрощена конфигурация** - `vercel.json` настроен правильно

## 🚀 Следующие шаги

### 1. Запушьте изменения в Git

```bash
cd dashboard
git add .
git commit -m "Fix Vercel API routing - remove /api prefix from Express routes"
git push
```

### 2. Передеплойте на Vercel

#### Вариант A: Автоматический деплой (если подключен Git)

Vercel автоматически задеплоит после push в main ветку.

#### Вариант B: Через Vercel CLI

```bash
cd dashboard
vercel --prod
```

#### Вариант C: Через Vercel Dashboard

1. Зайдите в Vercel Dashboard
2. Откройте проект `safb-admin`
3. Нажмите "Redeploy" или сделайте новый commit

### 3. Проверьте работу API

После деплоя проверьте:

```bash
curl https://safb-admin.vercel.app/api/health
```

**Ожидаемый ответ:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "vercel"
}
```

### 4. Проверьте другие endpoints

- `https://safb-admin.vercel.app/api/content` - получить весь контент
- `https://safb-admin.vercel.app/api/content/hero` - получить секцию hero

## ⚠️ Если все еще получаете 404

### Проверьте настройки проекта в Vercel:

1. **Settings → General → Root Directory**
   - Должно быть: `dashboard`
   - Если пусто, укажите `dashboard`

2. **Settings → General → Framework Preset**
   - Должно быть: `Other` или не указано
   - НЕ должно быть: `Vite`, `Vue`, и т.д.

3. **Build Logs**
   - Откройте последний деплой
   - Проверьте Build Logs
   - Убедитесь, что `api/index.js` обнаружен и обработан

### Альтернативное решение

Если проблемы продолжаются, создайте отдельный проект только для API:

1. Создайте новый проект в Vercel
2. Назовите его `safb-api`
3. Укажите Root Directory: `dashboard`
4. Framework Preset: `Other`
5. Деплойте

Это гарантирует, что деплоится только API, а не Vue приложение.

## 📝 Изменения в коде

### До:
```javascript
app.get('/api/health', ...)  // ❌ Неправильно для Vercel
```

### После:
```javascript
app.get('/health', ...)  // ✅ Правильно - Vercel добавляет /api
```

Vercel автоматически добавляет префикс `/api` через `vercel.json`, поэтому в Express роутах его не нужно указывать.

## ✅ Готово!

После передеплоя API должен работать. Если все еще есть проблемы, см. [VERCEL_FIX.md](./VERCEL_FIX.md) для дополнительных решений.
