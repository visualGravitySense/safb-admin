# SAF Dashboard

Dashboard для управления контентом сайта Siim Aimla Funk Band.

🌐 **Live Demo:** [GitHub Pages](https://visualGravitySense.github.io/safb-admin/)

📦 **Деплой:**
- **Dashboard на GitHub Pages:** См. [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) для быстрой инструкции
- **API на Vercel:** См. [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md) для быстрого старта или [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) для подробной инструкции

## Установка

```bash
npm install
```

## Запуск

### Вариант 1: Запуск API + Dashboard одновременно (рекомендуется)
```bash
npm run dev:all
```

Если возникают проблемы, используйте:
```bash
npm run dev:all:concurrent
```

### Вариант 2: Запуск отдельно (для Windows, если есть проблемы)

**Терминал 1 - API сервер:**
```bash
npm run dev:api
```

**Терминал 2 - Dashboard:**
```bash
npm run dev
```

### Порты
- **Dashboard:** http://localhost:3001
- **API Server:** http://localhost:3000

## Авторизация

По умолчанию:
- Username: `admin`
- Password: `SAFunk2024!Admin#Secure`

**Важно:** Измените эти данные в production!

### Изменение пароля

Создайте файл `.env` в папке `dashboard`:

```env
VITE_ADMIN_USERNAME=your_username
VITE_ADMIN_PASSWORD=your_strong_password
```

Подробнее см. [SECURITY.md](./SECURITY.md)

## Функционал

Dashboard позволяет управлять:

- **Hero Section** - главная секция сайта (заголовок, подзаголовок, CTA кнопки, статистика)
- **About / Members** - информация о бэнде и участниках
- **Events** - управление концертами и событиями
- **Music** - YouTube видео, альбомы, ссылки на стриминговые сервисы
- **Gallery** - управление фотогалереей
- **Statistics** - статистика сайта
- **Booking** - настройки формы бронирования

## Хранение данных

✅ **Данные сохраняются через REST API**

### Локальная разработка
- Данные сохраняются в файл `server/data/content.json`
- Файлы загружаются в `server/uploads/`

### Production (Vercel)
- API развернут на Vercel как serverless functions
- ⚠️ **Важно:** Текущая реализация использует временное хранилище `/tmp`, которое не сохраняет данные между вызовами
- Для production рекомендуется использовать:
  - **Vercel Blob Storage** для файлов
  - **База данных** (MongoDB, Supabase) для контента
  - См. [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) для подробностей

### API Endpoints
- `GET /api/content` - получить весь контент
- `GET /api/content/:section` - получить секцию
- `PUT /api/content/:section` - обновить секцию
- `POST /api/upload` - загрузить изображение
- `DELETE /api/upload/:filename` - удалить изображение
- `GET /api/health` - проверка работы API

Подробнее см. [API_GUIDE.md](./API_GUIDE.md)

### Fallback
Если API недоступен, Dashboard автоматически использует localStorage как резервный вариант.

## Интеграция с основным сайтом

Для интеграции с основным React сайтом:

1. Экспортируйте данные из localStorage или API
2. Импортируйте данные в React приложение
3. Обновите компоненты для чтения данных из API/хранилища

## Структура проекта

```
dashboard/
├── src/
│   ├── views/          # Страницы дашборда
│   ├── components/     # Компоненты
│   ├── layouts/        # Макеты
│   ├── router/         # Роутинг
│   ├── stores/         # Pinia stores
│   └── main.js         # Точка входа
├── public/             # Статические файлы
└── package.json
```

## Загрузка изображений

✅ **Поддержка загрузки изображений реализована!**

- Загрузка изображений для Gallery
- Загрузка фото участников
- Поддержка форматов: JPEG, PNG, GIF, WebP
- Максимальный размер: 10MB

Подробнее см. [UPLOAD_GUIDE.md](./UPLOAD_GUIDE.md)

## Деплой

### Dashboard на GitHub Pages
1. Настройте переменную окружения `VITE_API_URL` с URL вашего Vercel API
2. Следуйте инструкциям в [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

### API на Vercel
1. Следуйте инструкциям в [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)
2. После деплоя обновите `VITE_API_URL` в dashboard

## Следующие шаги

1. ✅ Настроить API для сохранения данных
2. ✅ Добавить загрузку изображений
3. ✅ Настроить деплой API на Vercel
4. ⏳ Настроить постоянное хранилище для production (Vercel Blob Storage / База данных)
5. ⏳ Добавить предпросмотр изменений
6. ⏳ Настроить экспорт данных для основного сайта
