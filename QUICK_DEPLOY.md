# Быстрый деплой на GitHub Pages

## Минимальные шаги для деплоя

### 1. Настройте GitHub Pages

1. Откройте: https://github.com/visualGravitySense/safb-admin/settings/pages
2. В разделе **Source** выберите **GitHub Actions**
3. Сохраните

### 2. Запушьте код

```bash
cd dashboard
git add .
git commit -m "Setup GitHub Pages"
git push origin main
```

### 3. Проверьте деплой

1. Перейдите в **Actions**: https://github.com/visualGravitySense/safb-admin/actions
2. Дождитесь завершения workflow (зеленая галочка)
3. Откройте: https://visualGravitySense.github.io/safb-admin/

## ⚠️ Важно: API сервер

GitHub Pages **не поддерживает** серверный код!

API нужно развернуть отдельно. Варианты:

### ✅ Вариант A: Vercel (рекомендуется, уже настроено!)

Если вы уже задеплоили на Vercel (как в вашем случае):

1. Получите URL вашего Vercel API (например: `https://safb-admin.vercel.app`)
2. Создайте файл `.env.production` в папке `dashboard/`:
   ```env
   VITE_API_URL=https://safb-admin.vercel.app/api
   ```
3. Пересоберите проект: `npm run build:gh-pages`
4. Запушьте изменения и задеплойте на GitHub Pages

**Готово!** Dashboard будет использовать ваш Vercel API.

Подробнее см. [NEXT_STEPS.md](./NEXT_STEPS.md)

### Вариант B: Railway

1. Зарегистрируйтесь на https://railway.app
2. Создайте новый проект
3. Подключите репозиторий
4. Укажите:
   - **Root Directory**: `dashboard/server`
   - **Start Command**: `node index.js`
5. Получите URL (например: `https://safb-api.railway.app`)
6. Добавьте secret в GitHub:
   - Settings → Secrets → New secret
   - Name: `VITE_API_URL`
   - Value: `https://safb-api.railway.app/api`

### Вариант C: Render

1. Зарегистрируйтесь на https://render.com
2. Создайте новый Web Service
3. Подключите репозиторий
4. Укажите:
   - **Root Directory**: `dashboard/server`
   - **Build Command**: (оставьте пустым)
   - **Start Command**: `node index.js`
5. Получите URL и добавьте secret как выше

### Вариант D: Heroku

```bash
cd dashboard/server
heroku create safb-api
git subtree push --prefix . heroku main
```

## После настройки API

1. Добавьте secret `VITE_API_URL` в GitHub
2. Сделайте новый push или перезапустите workflow
3. Dashboard будет использовать ваш API

## Готово! 🎉

Dashboard доступен по адресу:
**https://visualGravitySense.github.io/safb-admin/**

Логин: `admin`
Пароль: `SAFunk2024!Admin#Secure`
