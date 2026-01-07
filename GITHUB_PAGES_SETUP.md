# Настройка GitHub Pages - Пошаговая инструкция

## Шаг 1: Подготовка репозитория

1. Убедитесь, что ваш код находится в репозитории: `https://github.com/visualGravitySense/safb-admin`
2. Проверьте, что ветка называется `main` или `master`

## Шаг 2: Настройка GitHub Pages

1. Перейдите в ваш репозиторий на GitHub
2. Нажмите на **Settings** (в верхней панели)
3. В левом меню найдите **Pages**
4. В разделе **Source** выберите **GitHub Actions** (не "Deploy from a branch")
5. Сохраните изменения

## Шаг 3: Настройка Secrets (опционально)

Если нужно изменить значения по умолчанию:

1. В Settings → **Secrets and variables** → **Actions**
2. Нажмите **New repository secret**
3. Добавьте следующие secrets (если нужно):

   - **VITE_API_URL** - URL вашего API сервера
     - Пример: `https://safb-api.herokuapp.com/api`
   
   - **VITE_REACT_SITE_URL** - URL React сайта для предпросмотра
     - Пример: `https://your-react-site.com`
   
   - **VITE_ADMIN_USERNAME** - имя пользователя (по умолчанию: `admin`)
   
   - **VITE_ADMIN_PASSWORD** - пароль (по умолчанию: `SAFunk2024!Admin#Secure`)

## Шаг 4: Первый деплой

### Вариант 1: Автоматический деплой

1. Сделайте commit и push в ветку `main`:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. GitHub Actions автоматически запустит деплой

### Вариант 2: Ручной запуск

1. Перейдите в **Actions** в вашем репозитории
2. Выберите workflow **Deploy to GitHub Pages**
3. Нажмите **Run workflow**
4. Выберите ветку `main`
5. Нажмите **Run workflow**

## Шаг 5: Проверка деплоя

1. Подождите завершения workflow (обычно 2-3 минуты)
2. Перейдите в **Actions** и проверьте статус
3. Если успешно, откройте: `https://visualGravitySense.github.io/safb-admin/`

## Важно: API сервер

⚠️ **GitHub Pages не поддерживает серверный код!**

API сервер (`server/index.js`) нужно развернуть отдельно:

### Варианты развертывания API:

1. **Heroku** (бесплатный tier доступен)
   ```bash
   # В папке dashboard
   heroku create safb-api
   git subtree push --prefix server heroku main
   ```

2. **Railway** (бесплатный tier)
   - Подключите репозиторий
   - Укажите root directory: `server`
   - Railway автоматически задеплоит

3. **Render** (бесплатный tier)
   - Создайте новый Web Service
   - Укажите root directory: `server`
   - Build command: (не требуется)
   - Start command: `node index.js`

4. **Vercel** (с serverless функциями)
   - Можно задеплоить API как serverless функции

### После развертывания API:

1. Получите URL вашего API (например: `https://safb-api.herokuapp.com`)
2. Добавьте secret `VITE_API_URL` в GitHub:
   - Значение: `https://safb-api.herokuapp.com/api`
3. Пересоберите Dashboard (новый push или ручной запуск workflow)

## Структура файлов для деплоя

```
dashboard/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── .nojekyll                   # Отключает Jekyll на GitHub Pages
├── vite.config.js              # Конфигурация с base path
├── src/
│   └── router/
│       └── index.js            # Router с поддержкой base path
└── package.json                # Скрипты сборки
```

## Troubleshooting

### Ошибка 404 при переходе по ссылкам

- Убедитесь, что base path правильный (`/safb-admin/`)
- Проверьте, что router использует `createWebHistory` с base

### API запросы не работают

- Проверьте CORS настройки на API сервере
- Убедитесь, что `VITE_API_URL` правильный
- Проверьте консоль браузера на ошибки

### Страница не обновляется

- Очистите кэш браузера (Ctrl+Shift+R)
- Проверьте, что workflow завершился успешно
- Подождите несколько минут (GitHub Pages может кэшировать)

## Полезные ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
