# API Guide - Dashboard Content Management

## Обзор

Dashboard теперь использует REST API для сохранения и загрузки данных вместо localStorage. API сервер написан на Express.js и сохраняет данные в JSON файл.

## Структура API

### Базовый URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Получить весь контент
```
GET /api/content
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "hero": { ... },
    "about": { ... },
    "events": [ ... ],
    ...
  }
}
```

#### 2. Получить конкретную секцию
```
GET /api/content/:section
```

**Примеры:**
- `GET /api/content/hero`
- `GET /api/content/events`
- `GET /api/content/music`

**Ответ:**
```json
{
  "success": true,
  "data": { ... }
}
```

#### 3. Обновить секцию
```
PUT /api/content/:section
```

**Body:**
```json
{
  "title": "New Title",
  "subtitle": "New Subtitle",
  ...
}
```

**Ответ:**
```json
{
  "success": true,
  "data": { ... }
}
```

#### 4. Загрузка изображения
```
POST /api/upload
Content-Type: multipart/form-data

Body (form-data):
  image: [file]
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/image-1234567890-123456789.jpg",
    "filename": "image-1234567890-123456789.jpg",
    "originalName": "photo.jpg",
    "size": 123456,
    "mimetype": "image/jpeg"
  }
}
```

#### 5. Удаление изображения
```
DELETE /api/upload/:filename
```

**Ответ:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

#### 6. Health Check
```
GET /api/health
```

**Ответ:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Запуск

### Вариант 1: Запуск только API сервера
```bash
npm run dev:api
```

### Вариант 2: Запуск API + Dashboard одновременно
```bash
npm run dev:all
```

### Вариант 3: Запуск отдельно
```bash
# Терминал 1 - API
npm run dev:api

# Терминал 2 - Dashboard
npm run dev
```

## Хранение данных

Данные сохраняются в файл:
```
dashboard/server/data/content.json
```

Этот файл автоматически создается при первом запуске API.

## Конфигурация

### Изменение порта API

Создайте файл `.env`:
```
PORT=3000
```

Или установите переменную окружения:
```bash
PORT=3000 npm run dev:api
```

### Изменение URL API в Dashboard

Создайте файл `.env` в корне dashboard:
```
VITE_API_URL=http://localhost:3000/api
```

## Fallback механизм

Если API недоступен, Dashboard автоматически переключается на localStorage как резервный вариант. Это позволяет работать офлайн или при проблемах с API.

## Миграция данных

Если у вас уже есть данные в localStorage:

1. Откройте Dashboard
2. Данные автоматически загрузятся из localStorage
3. При сохранении они будут отправлены в API
4. После успешного сохранения localStorage больше не используется

## Интеграция с основным сайтом

### Вариант 1: Прямое использование API

В React приложении (SAFunkBand):

```javascript
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

// Загрузить контент
const loadContent = async () => {
  const response = await axios.get(`${API_URL}/content`)
  return response.data.data
}

// Использовать в компонентах
const heroContent = await loadContent()
```

### Вариант 2: Экспорт в статический файл

Создайте скрипт для экспорта:

```javascript
// scripts/export-content.js
import axios from 'axios'
import { writeFileSync } from 'fs'

const response = await axios.get('http://localhost:3000/api/content')
writeFileSync('./src/data/content.json', JSON.stringify(response.data.data, null, 2))
```

Затем импортируйте в React:
```javascript
import contentData from './data/content.json'
```

## Безопасность

⚠️ **Важно для production:**

1. **Добавьте аутентификацию:**
   - JWT токены
   - API ключи
   - Rate limiting

2. **Валидация данных:**
   - Проверка типов
   - Санитизация входных данных
   - Валидация схемы

3. **Ошибки:**
   - Не раскрывайте детали ошибок в production
   - Логируйте ошибки на сервере

4. **CORS:**
   - Настройте правильные CORS политики
   - Ограничьте доступ только с нужных доменов

## Примеры использования

### Обновление Hero секции
```javascript
await axios.put('http://localhost:3000/api/content/hero', {
  title: 'New Title',
  subtitle: 'New Subtitle'
})
```

### Добавление события
```javascript
// Сначала получить текущие события
const response = await axios.get('http://localhost:3000/api/content/events')
const events = response.data.data

// Добавить новое
events.push({
  date: '15. DETS 2024',
  title: 'New Event',
  location: 'Tallinn',
  price: '25€'
})

// Сохранить
await axios.put('http://localhost:3000/api/content/events', events)
```

## Следующие шаги

1. ✅ API сервер создан
2. ✅ Dashboard интегрирован с API
3. ⏳ Добавить аутентификацию API
4. ⏳ Мигрировать на базу данных (MongoDB, PostgreSQL)
5. ⏳ Добавить валидацию данных
6. ⏳ Настроить production deployment
