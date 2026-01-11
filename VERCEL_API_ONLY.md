# Деплой только API на Vercel

Если вы хотите использовать Vercel **только для API**, а dashboard и сайт будут на GitHub Pages, вот что нужно знать.

## 📁 Что нужно залить на Vercel

### Вариант 1: Вся папка `dashboard/` (рекомендуется)

**Заливайте всю папку `dashboard/`**, но Vercel будет использовать только:

```
dashboard/
├── api/
│   └── index.js          ✅ Используется (serverless function)
├── vercel.json           ✅ Используется (конфигурация)
├── package.json          ✅ Используется (зависимости)
└── остальные файлы       ❌ Игнорируются Vercel
```

**Преимущества:**
- ✅ Все файлы в одном месте
- ✅ Легко поддерживать
- ✅ Можно использовать один репозиторий

**Настройки в Vercel:**
- **Root Directory**: `dashboard` (если репозиторий содержит несколько проектов)
- Vercel автоматически найдет `api/` и `vercel.json`

### Вариант 2: Минимальная структура (только API)

Если хотите создать отдельный проект только для API:

```
api-vercel/
├── api/
│   └── index.js
├── vercel.json
└── package.json
```

**Минимальный `package.json` для API:**
```json
{
  "name": "saf-api",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^5.2.1",
    "cors": "^2.8.5",
    "multer": "^2.0.2"
  }
}
```

## 🚀 Инструкция по деплою

### Через веб-интерфейс Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. **Add New Project** → Импортируйте репозиторий
3. **Настройки:**
   - **Root Directory**: `dashboard` (если весь репозиторий) или оставьте пустым (если только API)
   - **Framework Preset**: Other
   - **Build Command**: (оставьте пустым)
   - **Output Directory**: (оставьте пустым)
4. **Deploy**

### Через Vercel CLI

```bash
cd dashboard
vercel login
vercel
vercel --prod
```

## 📦 Что Vercel будет использовать

Vercel автоматически:
1. ✅ Найдет `api/index.js` и создаст serverless function
2. ✅ Прочитает `vercel.json` для конфигурации роутов
3. ✅ Установит зависимости из `package.json`
4. ❌ Игнорирует `src/`, `public/`, `vite.config.js` и другие файлы фронтенда

## ⚙️ Настройка Root Directory

Если ваш репозиторий содержит несколько проектов:

```
your-repo/
├── dashboard/          ← API здесь
│   ├── api/
│   ├── vercel.json
│   └── package.json
├── SAFunkBand/         ← Основной сайт
└── другие папки
```

В Vercel Dashboard:
- Settings → General → Root Directory → `dashboard`

## 🔍 Проверка деплоя

После деплоя проверьте:

```bash
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

## 📝 Важные файлы для API

Для работы API на Vercel нужны только:

1. **`api/index.js`** - основной serverless function
2. **`vercel.json`** - конфигурация роутинга
3. **`package.json`** - зависимости (express, cors, multer)

Все остальное (Vue компоненты, Vite конфиг, и т.д.) **не нужно** для API, но и не мешает.

## 💡 Рекомендация

**Используйте Вариант 1** - заливайте всю папку `dashboard/`:
- ✅ Проще поддерживать
- ✅ Все в одном месте
- ✅ Vercel сам выберет нужные файлы
- ✅ Можно использовать один репозиторий для всего

Vercel достаточно умный, чтобы игнорировать ненужные файлы и использовать только то, что указано в `vercel.json` и `api/`.

## 🎯 Итог

**Ответ:** Заливайте всю папку `dashboard/` на Vercel, но Vercel будет использовать только:
- `api/index.js`
- `vercel.json`  
- `package.json`

Остальные файлы (Vue приложение, компоненты, и т.д.) будут проигнорированы Vercel и не повлияют на деплой API.
