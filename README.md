# SAF Dashboard

Dashboard для управления контентом сайта Siim Aimla Funk Band.

🌐 **Live Demo:** [GitHub Pages](https://visualGravitySense.github.io/safb-admin/)

📦 **Деплой на GitHub Pages:** См. [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) для быстрой инструкции

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

✅ **Данные сохраняются через REST API** в файл `server/data/content.json`

### API Endpoints
- `GET /api/content` - получить весь контент
- `GET /api/content/:section` - получить секцию
- `PUT /api/content/:section` - обновить секцию
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

## Следующие шаги

1. ✅ Настроить API для сохранения данных
2. ✅ Добавить загрузку изображений
3. ⏳ Добавить предпросмотр изменений
4. ⏳ Настроить экспорт данных для основного сайта
