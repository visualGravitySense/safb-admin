# Проверка настроек проекта в Vercel Dashboard

## 📍 Где найти настройки

В Vercel Dashboard для проекта `safb-admin`:

1. Откройте проект
2. Перейдите в **Settings** (вкладка вверху)
3. В левом меню выберите **"Build and Deployment"** (НЕ "General")

## ✅ Что проверить в Build and Deployment

### 1. Framework Preset

**Где найти:** Settings → Build and Deployment → Framework Preset

**Правильное значение:**
- ✅ **Other** (рекомендуется)
- ✅ **Not set** / **None** (тоже OK)

**Неправильные значения:**
- ❌ Vite
- ❌ Vue
- ❌ React
- ❌ Next.js
- ❌ Любой другой фреймворк

**Почему:** Vercel может пытаться собрать Vue приложение вместо API, если указан фреймворк.

**Как изменить:**
1. Найдите поле "Framework Preset"
2. Выберите **"Other"** из выпадающего списка
3. Нажмите "Save"

### 2. Root Directory

**Где найти:** Settings → Build and Deployment → Root Directory

**Правильное значение:**
- ✅ `dashboard` (если ваш репозиторий содержит несколько проектов)
- ✅ Пусто (если весь репозиторий - это dashboard проект)

**Как определить:**
- Если структура репозитория такая:
  ```
  your-repo/
  ├── dashboard/     ← API здесь
  ├── SAFunkBand/    ← Другой проект
  └── другие папки
  ```
  Тогда укажите: `dashboard`

- Если структура такая:
  ```
  dashboard/         ← Весь репозиторий это dashboard
  ├── api/
  ├── src/
  └── ...
  ```
  Тогда оставьте пустым

**Как изменить:**
1. Найдите поле "Root Directory"
2. Введите `dashboard` или оставьте пустым (в зависимости от структуры)
3. Нажмите "Save"

### 3. Build Command

**Где найти:** Settings → Build and Deployment → Build Command

**Правильное значение:**
- ✅ **Пусто** (рекомендуется для API)
- ✅ Не указано

**Неправильные значения:**
- ❌ `npm run build`
- ❌ `vite build`
- ❌ Любая команда сборки

**Почему:** API не требует сборки, это serverless function.

**Как изменить:**
1. Найдите поле "Build Command"
2. Удалите все команды (оставьте пустым)
3. Нажмите "Save"

### 4. Output Directory

**Где найти:** Settings → Build and Deployment → Output Directory

**Правильное значение:**
- ✅ **Пусто**
- ✅ Не указано

**Неправильные значения:**
- ❌ `dist`
- ❌ `build`
- ❌ Любая папка

**Почему:** API не генерирует статические файлы.

**Как изменить:**
1. Найдите поле "Output Directory"
2. Удалите все значения (оставьте пустым)
3. Нажмите "Save"

### 5. Install Command

**Где найти:** Settings → Build and Deployment → Install Command

**Правильное значение:**
- ✅ `npm install` (по умолчанию)
- ✅ Можно оставить как есть

**Обычно менять не нужно.**

## 📋 Чеклист проверки

Откройте Settings → Build and Deployment и проверьте:

- [ ] Framework Preset = **Other** (или Not set)
- [ ] Root Directory = `dashboard` (или пусто, в зависимости от структуры)
- [ ] Build Command = **пусто**
- [ ] Output Directory = **пусто**
- [ ] Install Command = `npm install` (или по умолчанию)

## 🔧 Как исправить

1. **Откройте Build and Deployment:**
   - Settings → Build and Deployment

2. **Измените настройки:**
   - Framework Preset → выберите **Other**
   - Build Command → удалите, оставьте пустым
   - Output Directory → удалите, оставьте пустым
   - Root Directory → укажите `dashboard` (если нужно)

3. **Сохраните:**
   - Нажмите "Save" внизу страницы

4. **Передеплойте:**
   - Сделайте новый commit и push
   - Или нажмите "Redeploy" на последнем деплое

## ⚠️ Важно

После изменения настроек:
1. ✅ Сохраните изменения
2. ✅ Сделайте новый деплой (commit + push или Redeploy)
3. ✅ Проверьте Build Logs - не должно быть ошибок
4. ✅ Проверьте API: `curl https://safb-admin.vercel.app/api/health`

## 🎯 Быстрая настройка

Если хотите быстро исправить все настройки:

1. Settings → Build and Deployment
2. Установите:
   - Framework Preset: **Other**
   - Root Directory: `dashboard` (или пусто)
   - Build Command: **(удалите, оставьте пустым)**
   - Output Directory: **(удалите, оставьте пустым)**
3. Save
4. Redeploy

## ✅ После исправления

После правильной настройки:
- ✅ Деплой должен пройти успешно
- ✅ API должен работать по `/api/health`
- ✅ Не должно быть ошибок о конфликтах конфигураций
