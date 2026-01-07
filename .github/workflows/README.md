# GitHub Actions Workflows

## deploy.yml

Автоматический деплой Dashboard на GitHub Pages при push в ветку `main` или `master`.

### Что делает:

1. Устанавливает Node.js 20
2. Устанавливает зависимости (`npm ci`)
3. Собирает проект (`npm run build`) с правильным base path для GitHub Pages
4. Загружает артефакт
5. Деплоит на GitHub Pages

### Переменные окружения:

Workflow использует следующие secrets (опционально):
- `VITE_API_URL` - URL API сервера
- `VITE_REACT_SITE_URL` - URL React сайта для предпросмотра
- `VITE_ADMIN_USERNAME` - имя пользователя администратора
- `VITE_ADMIN_PASSWORD` - пароль администратора

Если secrets не установлены, используются значения по умолчанию.
