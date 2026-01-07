# Чеклист для деплоя на GitHub Pages

## ✅ Перед деплоем

- [ ] Код закоммичен и запушен в репозиторий
- [ ] Репозиторий: `https://github.com/visualGravitySense/safb-admin`
- [ ] Ветка: `main` или `master`

## ✅ Настройка GitHub Pages

1. [ ] Откройте: https://github.com/visualGravitySense/safb-admin/settings/pages
2. [ ] В разделе **Source** выберите **GitHub Actions** (не "Deploy from a branch")
3. [ ] Сохраните изменения

## ✅ Настройка Secrets (опционально)

Если нужно изменить значения по умолчанию:

1. [ ] Откройте: https://github.com/visualGravitySense/safb-admin/settings/secrets/actions
2. [ ] Добавьте secrets (если нужно):
   - [ ] `VITE_API_URL` - URL вашего API сервера
   - [ ] `VITE_REACT_SITE_URL` - URL React сайта
   - [ ] `VITE_ADMIN_USERNAME` - имя пользователя
   - [ ] `VITE_ADMIN_PASSWORD` - пароль

## ✅ Первый деплой

1. [ ] Сделайте push в ветку `main`:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. [ ] Или запустите workflow вручную:
   - Откройте: https://github.com/visualGravitySense/safb-admin/actions
   - Выберите "Deploy to GitHub Pages"
   - Нажмите "Run workflow"

## ✅ Проверка деплоя

1. [ ] Подождите завершения workflow (2-3 минуты)
2. [ ] Проверьте статус в Actions (должна быть зеленая галочка)
3. [ ] Откройте: https://visualGravitySense.github.io/safb-admin/
4. [ ] Проверьте вход:
   - Username: `admin`
   - Password: `SAFunk2024!Admin#Secure`

## ⚠️ Важно: API сервер

GitHub Pages **не поддерживает** серверный код!

- [ ] Разверните API отдельно (Railway, Render, Heroku и т.д.)
- [ ] Получите URL вашего API
- [ ] Добавьте secret `VITE_API_URL` в GitHub
- [ ] Пересоберите Dashboard (новый push)

## 📝 После деплоя

- [ ] Обновите ссылку в README.md на актуальный URL
- [ ] Проверьте все функции Dashboard
- [ ] Убедитесь, что API работает корректно

## 🔗 Полезные ссылки

- Репозиторий: https://github.com/visualGravitySense/safb-admin
- GitHub Pages: https://visualGravitySense.github.io/safb-admin/
- Actions: https://github.com/visualGravitySense/safb-admin/actions
- Settings: https://github.com/visualGravitySense/safb-admin/settings
