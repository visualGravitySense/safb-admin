# Следующие шаги после деплоя на Vercel

## ✅ Что уже сделано

Ваш проект успешно задеплоен на Vercel:
- **URL:** `safb-admin.vercel.app`
- **Deployment URL:** `safb-admin-3kp8k9cx7-visuals-projects-8152d825.vercel.app`

## 🔍 Шаг 1: Проверка работы API

Проверьте, что API работает:

### В браузере откройте:
```
https://safb-admin.vercel.app/api/health
```

Или через curl:
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

### Проверьте другие endpoints:
- `https://safb-admin.vercel.app/api/content` - получить весь контент
- `https://safb-admin.vercel.app/api/content/hero` - получить секцию hero

## ⚙️ Шаг 2: Настройка Dashboard для GitHub Pages

Теперь нужно настроить dashboard, чтобы он использовал ваш Vercel API.

### 2.1 Создайте файл `.env.production`

В папке `dashboard/` создайте файл `.env.production`:

```env
VITE_API_URL=https://safb-admin.vercel.app/api
```

**Важно:** Используйте основной домен `safb-admin.vercel.app`, а не deployment URL.

### 2.2 Обновите build для GitHub Pages

```bash
cd dashboard
npm run build:gh-pages
```

Это создаст сборку с правильным API URL.

### 2.3 Деплой на GitHub Pages

Следуйте инструкциям в [QUICK_DEPLOY.md](./QUICK_DEPLOY.md):

```bash
# Если еще не настроено:
git add .
git commit -m "Configure Vercel API URL"
git push

# Затем следуйте инструкциям для GitHub Pages
```

## 🎯 Шаг 3: Настройка основного сайта (SAFunkBand)

Если ваш основной React сайт тоже должен использовать этот API:

### 3.1 В папке `SAFunkBand/`

Создайте файл `.env.production`:

```env
VITE_API_URL=https://safb-admin.vercel.app/api
```

### 3.2 Обновите код для использования API

Убедитесь, что ваш React сайт использует `import.meta.env.VITE_API_URL` для запросов к API.

## 📝 Шаг 4: Проверка интеграции

### 4.1 Проверьте Dashboard на GitHub Pages

1. Откройте ваш dashboard на GitHub Pages
2. Войдите в систему
3. Попробуйте загрузить контент - он должен загружаться с Vercel API
4. Попробуйте сохранить изменения - они должны сохраняться на Vercel

### 4.2 Проверьте основной сайт

1. Откройте ваш основной сайт
2. Убедитесь, что контент загружается с Vercel API

## ⚠️ Важные замечания

### Хранение данных

**Текущая реализация использует временное хранилище `/tmp`**, которое:
- ❌ Не сохраняет данные между вызовами функций
- ❌ Файлы удаляются после завершения функции

**Для production рекомендуется:**
1. **Vercel Blob Storage** - для файлов изображений
2. **База данных** (MongoDB Atlas, Supabase) - для контента
3. **Vercel KV** - для простых JSON данных

См. [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) для подробностей.

### CORS

CORS уже настроен в `api/index.js`, но если возникнут проблемы:
- Проверьте, что `VITE_API_URL` указан правильно
- Убедитесь, что используете HTTPS URL

## 🔧 Troubleshooting

### Проблема: API возвращает 404

**Решение:**
- Проверьте, что URL правильный: `https://safb-admin.vercel.app/api/health`
- Убедитесь, что `vercel.json` правильно настроен

### Проблема: Dashboard не может подключиться к API

**Решение:**
1. Проверьте `.env.production` файл
2. Убедитесь, что пересобрали проект: `npm run build:gh-pages`
3. Проверьте консоль браузера на ошибки CORS

### Проблема: Данные не сохраняются

**Решение:**
Это ожидаемое поведение с текущей реализацией. Для production нужно настроить постоянное хранилище (см. выше).

## 📚 Полезные ссылки

- [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md) - Быстрый старт
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Подробная инструкция
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Деплой на GitHub Pages
- [API_GUIDE.md](./API_GUIDE.md) - Документация API

## ✅ Чеклист

- [ ] Проверил работу API (`/api/health`)
- [ ] Создал `.env.production` с правильным API URL
- [ ] Пересобрал dashboard (`npm run build:gh-pages`)
- [ ] Задеплоил dashboard на GitHub Pages
- [ ] Проверил работу dashboard с Vercel API
- [ ] Настроил основной сайт для использования API (если нужно)
- [ ] Планирую настроить постоянное хранилище для production
