# Резюме настройки Vercel для API

## ✅ Что было сделано

### 1. Создана структура для Vercel

- **`api/index.js`** - Serverless function для Vercel, адаптированный из Express сервера
- **`vercel.json`** - Конфигурация Vercel для роутинга API запросов
- **`server/index.js`** - Оставлен для локальной разработки (без изменений)

### 2. Адаптация для Vercel

- ✅ Определение окружения (Vercel vs локальное)
- ✅ Использование `/tmp` для временных файлов на Vercel
- ✅ Поддержка всех существующих API endpoints
- ✅ CORS настроен для работы с GitHub Pages

### 3. Документация

- **`VERCEL_QUICK_START.md`** - Быстрая инструкция по деплою
- **`VERCEL_DEPLOY.md`** - Подробная инструкция с troubleshooting
- Обновлен **`README.md`** с информацией о Vercel

## 📁 Структура файлов

```
dashboard/
├── api/
│   └── index.js              # Vercel serverless function
├── server/
│   ├── index.js              # Локальный сервер (dev)
│   ├── data/
│   │   └── content.json      # Данные контента
│   └── uploads/              # Загруженные файлы
├── vercel.json               # Конфигурация Vercel
├── VERCEL_QUICK_START.md     # Быстрый старт
├── VERCEL_DEPLOY.md          # Подробная инструкция
└── README.md                 # Обновлен с информацией о Vercel
```

## 🚀 Следующие шаги

### 1. Деплой на Vercel

```bash
cd dashboard
vercel login
vercel
vercel --prod
```

Или через веб-интерфейс на [vercel.com](https://vercel.com)

### 2. Настройка Dashboard

После получения URL Vercel API (например: `https://your-project.vercel.app`):

Создайте `.env.production`:
```env
VITE_API_URL=https://your-project.vercel.app/api
```

### 3. Деплой Dashboard на GitHub Pages

```bash
npm run build:gh-pages
# Следуйте инструкциям в QUICK_DEPLOY.md
```

## ⚠️ Важные замечания

### Хранение данных

**Текущая реализация:**
- Использует `/tmp` на Vercel (временное хранилище)
- Данные **не сохраняются** между вызовами функций
- Файлы удаляются после завершения функции

**Для production рекомендуется:**
1. **Vercel Blob Storage** - для файлов изображений
2. **База данных** (MongoDB Atlas, Supabase) - для контента
3. **Vercel KV** - для простых JSON данных

### API Endpoints

Все endpoints работают как на локальном сервере, так и на Vercel:

- `GET /api/content` - получить весь контент
- `GET /api/content/:section` - получить секцию
- `PUT /api/content/:section` - обновить секцию
- `PUT /api/content` - обновить весь контент
- `POST /api/upload` - загрузить изображение
- `GET /api/uploads/:filename` - получить изображение
- `DELETE /api/upload/:filename` - удалить изображение
- `GET /api/health` - проверка работы API

## 🔧 Локальная разработка

Для локальной разработки используйте существующий сервер:

```bash
npm run dev:api    # Запуск локального API
npm run dev        # Запуск dashboard
npm run dev:all    # Запуск обоих одновременно
```

Локальный сервер использует `server/data/content.json` и `server/uploads/` для хранения.

## 📚 Дополнительная информация

- [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md) - Быстрый старт
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Подробная инструкция
- [API_GUIDE.md](./API_GUIDE.md) - Документация API
- [README.md](./README.md) - Общая информация
