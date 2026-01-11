# Настройка интеграции Dashboard и основного сайта с Vercel API

## ✅ Что уже сделано

1. ✅ API развернут на Vercel: `https://safb-admin.vercel.app/api`
2. ✅ API работает и возвращает JSON
3. ✅ Dashboard настроен на использование Vercel API URL
4. ✅ Основной сайт (SAFunkBand) уже имеет интеграцию с API

## 🔧 Настройка Dashboard

### Для Production (GitHub Pages)

Создайте файл `.env.production` в папке `dashboard/`:

```env
VITE_API_URL=https://safb-admin.vercel.app/api
```

### Для локальной разработки

Создайте файл `.env.local` в папке `dashboard/`:

```env
VITE_API_URL=http://localhost:3000/api
```

Или используйте локальный сервер:
```bash
npm run dev:api  # Запустит локальный API на порту 3000
```

## 🔧 Настройка основного сайта (SAFunkBand)

### Для Production

Создайте файл `.env.production` в папке `SAFunkBand/`:

```env
VITE_API_URL=https://safb-admin.vercel.app/api
```

### Для локальной разработки

Создайте файл `.env.local` в папке `SAFunkBand/`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📝 Пошаговая инструкция

### Шаг 1: Настройте Dashboard

1. В папке `dashboard/` создайте `.env.production`:
   ```env
   VITE_API_URL=https://safb-admin.vercel.app/api
   ```

2. Пересоберите dashboard:
   ```bash
   cd dashboard
   npm run build:gh-pages
   ```

3. Задеплойте на GitHub Pages (следуйте инструкциям в `QUICK_DEPLOY.md`)

### Шаг 2: Настройте основной сайт

1. В папке `SAFunkBand/` создайте `.env.production`:
   ```env
   VITE_API_URL=https://safb-admin.vercel.app/api
   ```

2. Пересоберите сайт:
   ```bash
   cd SAFunkBand
   npm run build
   ```

3. Задеплойте на GitHub Pages (или другой хостинг)

### Шаг 3: Проверьте работу

1. **Откройте Dashboard:**
   - Войдите в систему
   - Измените какой-нибудь контент (например, заголовок Hero)
   - Сохраните изменения

2. **Проверьте API:**
   ```bash
   curl https://safb-admin.vercel.app/api/content/hero
   ```
   Должен вернуться обновленный контент

3. **Откройте основной сайт:**
   - Обновите страницу (или перезагрузите)
   - Изменения должны отобразиться

## 🔄 Как работает интеграция

1. **Dashboard** → Сохраняет изменения → **Vercel API** (`/api/content/:section`)
2. **Vercel API** → Сохраняет в `/tmp/data/content.json` (временно)
3. **Основной сайт** → Загружает контент → **Vercel API** (`/api/content`)
4. **Основной сайт** → Отображает обновленный контент

## ⚠️ Важно: Хранение данных

**Текущая реализация использует временное хранилище `/tmp`**, которое:
- ❌ Не сохраняет данные между перезапусками функций
- ❌ Файлы удаляются после завершения функции

**Для production рекомендуется:**
1. **Vercel Blob Storage** - для файлов изображений
2. **База данных** (MongoDB Atlas, Supabase) - для контента
3. **Vercel KV** - для простых JSON данных

См. [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) для подробностей.

## 🧪 Тестирование локально

### Запуск всего стека локально:

**Терминал 1 - API:**
```bash
cd dashboard
npm run dev:api
```

**Терминал 2 - Dashboard:**
```bash
cd dashboard
npm run dev
```

**Терминал 3 - Основной сайт:**
```bash
cd SAFunkBand
npm run dev
```

Все будут использовать локальный API на `http://localhost:3000/api`.

## 📋 Чеклист настройки

- [ ] Создан `.env.production` в `dashboard/` с Vercel API URL
- [ ] Dashboard пересобран (`npm run build:gh-pages`)
- [ ] Dashboard задеплоен на GitHub Pages
- [ ] Создан `.env.production` в `SAFunkBand/` с Vercel API URL
- [ ] Основной сайт пересобран (`npm run build`)
- [ ] Основной сайт задеплоен
- [ ] Проверена работа: изменения в Dashboard отображаются на основном сайте

## ✅ Готово!

После выполнения этих шагов:
- ✅ Dashboard будет сохранять изменения в Vercel API
- ✅ Основной сайт будет загружать контент из Vercel API
- ✅ Изменения в Dashboard будут сразу видны на основном сайте

## 🔗 Полезные ссылки

- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Подробная инструкция по Vercel
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Деплой Dashboard на GitHub Pages
- [API_GUIDE.md](./API_GUIDE.md) - Документация API
