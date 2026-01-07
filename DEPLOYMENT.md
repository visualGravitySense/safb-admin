# Руководство по деплою на GitHub Pages

## Настройка GitHub Pages

### 1. Настройка репозитория

1. Перейдите в Settings → Pages вашего репозитория
2. В разделе "Source" выберите "GitHub Actions"
3. Сохраните изменения

### 2. Настройка Secrets (опционально)

Для настройки переменных окружения через GitHub Secrets:

1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте следующие secrets (если нужно изменить значения по умолчанию):
   - `VITE_API_URL` - URL вашего API сервера
   - `VITE_REACT_SITE_URL` - URL React сайта для предпросмотра
   - `VITE_ADMIN_USERNAME` - имя пользователя администратора
   - `VITE_ADMIN_PASSWORD` - пароль администратора

### 3. Деплой

После настройки, каждый push в ветку `main` или `master` автоматически запустит деплой.

Или запустите вручную:
1. Перейдите в Actions
2. Выберите workflow "Deploy to GitHub Pages"
3. Нажмите "Run workflow"

## URL после деплоя

После успешного деплоя Dashboard будет доступен по адресу:
```
https://visualGravitySense.github.io/safb-admin/
```

## Важные замечания

### API сервер

⚠️ **GitHub Pages работает только со статическими файлами!**

API сервер (`server/index.js`) **НЕ будет работать** на GitHub Pages. Вам нужно:

1. **Развернуть API отдельно** на:
   - Heroku
   - Railway
   - Render
   - Vercel (с serverless функциями)
   - Другой хостинг с поддержкой Node.js

2. **Обновить `VITE_API_URL`** в secrets или в коде для указания на ваш API сервер

### Пример настройки API URL

Если ваш API развернут на `https://safb-api.herokuapp.com`, установите:
```
VITE_API_URL=https://safb-api.herokuapp.com/api
```

### Локальная разработка

Для локальной разработки используйте:
```bash
npm run dev:all
```

Это запустит и API, и Dashboard локально.

## Структура деплоя

```
.github/workflows/deploy.yml  # GitHub Actions workflow
vite.config.js                # Конфигурация с base path для GitHub Pages
src/router/index.js          # Router с поддержкой base path
```

## Troubleshooting

### Страница не загружается

1. Проверьте, что в Settings → Pages выбран "GitHub Actions" как source
2. Проверьте логи в Actions для ошибок сборки
3. Убедитесь, что base path правильный (`/safb-admin/`)

### API не работает

- GitHub Pages не поддерживает серверный код
- Разверните API отдельно и обновите `VITE_API_URL`

### Роутинг не работает

- Убедитесь, что используется `createWebHistory` с правильным base path
- Проверьте, что все ссылки используют относительные пути

## Альтернативные варианты деплоя

Если GitHub Pages не подходит, рассмотрите:

- **Vercel** - поддержка serverless функций (можно задеплоить и API)
- **Netlify** - поддержка serverless функций
- **Railway** - поддержка Node.js приложений
- **Render** - поддержка Node.js приложений
