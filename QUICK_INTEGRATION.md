# Быстрая настройка интеграции

## 🚀 Быстрая инструкция

### 1. Настройте Dashboard

Создайте `.env.production` в папке `dashboard/`:
```env
VITE_API_URL=https://safb-admin.vercel.app/api
```

Пересоберите и задеплойте:
```bash
cd dashboard
npm run build:gh-pages
# Затем следуйте QUICK_DEPLOY.md
```

### 2. Настройте основной сайт

Создайте `.env.production` в папке `SAFunkBand/`:
```env
VITE_API_URL=https://safb-admin.vercel.app/api
```

Пересоберите и задеплойте:
```bash
cd SAFunkBand
npm run build
# Задеплойте на GitHub Pages или другой хостинг
```

### 3. Проверьте работу

1. Откройте Dashboard
2. Измените контент (например, заголовок Hero)
3. Сохраните
4. Откройте основной сайт
5. Обновите страницу - изменения должны отобразиться!

## ✅ Готово!

Теперь вы можете:
- ✅ Управлять контентом через Dashboard
- ✅ Изменения сразу видны на основном сайте
- ✅ Все работает через Vercel API

## 📚 Подробная инструкция

См. [INTEGRATION_SETUP.md](./INTEGRATION_SETUP.md) для подробной инструкции.
