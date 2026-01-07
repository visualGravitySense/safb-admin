# Настройка переменных окружения

## Создание .env файла

Создайте файл `.env` в корне папки `dashboard` со следующим содержимым:

```env
# Admin Dashboard Credentials
# For security, change these values in production!
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=SAFunk2024!Admin#Secure

# React Site URL for Preview
VITE_REACT_SITE_URL=http://localhost:5173

# API URL
VITE_API_URL=http://localhost:3000/api
```

## Изменение пароля

Чтобы изменить пароль администратора, отредактируйте `.env` файл:

```env
VITE_ADMIN_USERNAME=your_username
VITE_ADMIN_PASSWORD=your_strong_password
```

После изменения перезапустите Dashboard.

## Безопасность

⚠️ **ВАЖНО:**
- Файл `.env` уже добавлен в `.gitignore` и не будет закоммичен в Git
- Никогда не делитесь файлом `.env` публично
- Используйте разные пароли для development и production

Подробнее см. [SECURITY.md](./SECURITY.md)
