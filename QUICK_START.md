# Быстрый старт - API Dashboard

## 🚀 Запуск за 3 шага

### 1. Установите зависимости
```bash
cd dashboard
npm install
```

### 2. Запустите API + Dashboard
```bash
npm run dev:all
```

### 3. Откройте в браузере
- **Dashboard:** http://localhost:3001
- **API:** http://localhost:3000/api/health

## 🔐 Вход в Dashboard

- **Username:** `admin`
- **Password:** `admin`

## 📁 Где хранятся данные?

Данные сохраняются в:
```
dashboard/server/data/content.json
```

Этот файл создается автоматически при первом запуске API.

## ✅ Проверка работы

1. Откройте Dashboard: http://localhost:3001
2. Войдите с учетными данными
3. Отредактируйте любую секцию (например, Hero)
4. Нажмите "Save Changes"
5. Проверьте файл `server/data/content.json` - данные должны быть там

## 🔧 Альтернативный запуск

### Если `dev:all` не работает в Windows:

**Вариант 1: Использовать concurrently напрямую**
```bash
npm run dev:all:concurrent
```

**Вариант 2: Запустить в двух терминалах (самый надежный)**

**Терминал 1:**
```bash
npm run dev:api
```

**Терминал 2:**
```bash
npm run dev
```

## 📚 Дополнительная информация

- [API_GUIDE.md](./API_GUIDE.md) - подробное описание API
- [UPLOAD_GUIDE.md](./UPLOAD_GUIDE.md) - руководство по загрузке изображений
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - полное руководство по настройке
- [README.md](./README.md) - общая информация

## ❓ Проблемы?

### Ошибка "spawn cmd.exe ENOENT" в Windows
Если вы видите эту ошибку при запуске `npm run dev:all`:

**Решение 1 (рекомендуется):** Запустите в двух отдельных терминалах:
```bash
# Терминал 1
npm run dev:api

# Терминал 2 (в новом окне)
npm run dev
```

**Решение 2:** Используйте `start.bat` файл (дважды кликните на него)

**Решение 3:** См. [WINDOWS_FIX.md](./WINDOWS_FIX.md) для подробных инструкций

### API не запускается
- Убедитесь, что порт 3000 свободен
- Проверьте, что установлены все зависимости: `npm install`

### Dashboard не подключается к API
- Убедитесь, что API запущен на порту 3000
- Проверьте консоль браузера на ошибки
- Dashboard автоматически переключится на localStorage если API недоступен

### Данные не сохраняются
- Проверьте права на запись в папку `server/data/`
- Проверьте консоль API сервера на ошибки
- Убедитесь, что файл `content.json` создан
