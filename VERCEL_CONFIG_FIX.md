# Исправление конфликтующих конфигураций Vercel

## Проблема

Vercel выдает ошибку о конфликтующих конфигурациях между старыми файлами Now (предшественник Vercel) и новыми файлами Vercel.

## Решение

### 1. Проверьте и удалите старые файлы Now

Выполните в терминале в папке `dashboard`:

```bash
# Проверьте наличие файлов
ls -la | grep now
# или в Windows PowerShell:
dir /a | findstr now
```

#### Удалите следующие файлы/папки, если они существуют:

- ❌ `now.json` → удалите (если есть)
- ❌ `.now/` → удалите папку (если есть)
- ❌ `.nowignore` → удалите (если есть)

**Важно:** Оставьте только:
- ✅ `vercel.json` - это правильный файл конфигурации
- ✅ `.vercel/` - это правильная папка (если есть)

### 2. Проверьте переменные окружения в Vercel Dashboard

1. Зайдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Откройте ваш проект `safb-admin`
3. Перейдите в **Settings → Environment Variables**
4. Проверьте, нет ли переменных с префиксом `NOW_`

#### Если найдены переменные с префиксом `NOW_`:

- ❌ Удалите все переменные, начинающиеся с `NOW_`
- ✅ Используйте только переменные с префиксом `VERCEL_`

**Пример:**
- ❌ `NOW_ENV` → удалите
- ✅ `VERCEL_ENV` → оставьте (если нужна)

### 3. Проверьте .gitignore

Убедитесь, что в `.gitignore` нет упоминаний старых файлов Now, которые могут конфликтовать.

### 4. Очистите кэш Vercel (если нужно)

1. В Vercel Dashboard откройте проект
2. Settings → General
3. Прокрутите вниз до "Danger Zone"
4. Нажмите "Clear Build Cache" (если доступно)

### 5. Передеплойте проект

После исправления:

```bash
cd dashboard
git add .
git commit -m "Remove Now.js config conflicts"
git push
```

Или через Vercel CLI:
```bash
vercel --prod
```

## Быстрая проверка

Выполните эти команды в папке `dashboard`:

### Windows PowerShell:
```powershell
# Проверка файлов
Test-Path now.json
Test-Path .nowignore
Test-Path .now

# Если найдены, удалите:
# Remove-Item now.json -ErrorAction SilentlyContinue
# Remove-Item .nowignore -ErrorAction SilentlyContinue
# Remove-Item .now -Recurse -ErrorAction SilentlyContinue
```

### Linux/Mac:
```bash
# Проверка файлов
ls -la | grep -E "now.json|.nowignore|\.now"

# Если найдены, удалите:
# rm -f now.json
# rm -f .nowignore
# rm -rf .now
```

## Проверка после исправления

После удаления конфликтующих файлов и переменных:

1. ✅ Убедитесь, что есть только `vercel.json` (не `now.json`)
2. ✅ Убедитесь, что нет переменных с префиксом `NOW_`
3. ✅ Передеплойте проект
4. ✅ Проверьте, что деплой проходит успешно

## Если проблема сохраняется

1. **Проверьте Build Logs в Vercel Dashboard:**
   - Откройте последний деплой
   - Посмотрите Build Logs
   - Найдите точное сообщение об ошибке

2. **Создайте новый проект в Vercel:**
   - Если проблема не решается, создайте новый проект
   - Назовите его, например, `safb-api`
   - Укажите Root Directory: `dashboard`
   - Деплойте заново

3. **Проверьте версию Vercel CLI:**
   ```bash
   vercel --version
   npm install -g vercel@latest
   ```

## Текущая правильная структура

```
dashboard/
├── api/
│   └── index.js          ✅ Serverless function
├── vercel.json           ✅ Конфигурация Vercel
├── package.json          ✅ Зависимости
└── ...                   ✅ Остальные файлы
```

**НЕ должно быть:**
- ❌ `now.json`
- ❌ `.nowignore`
- ❌ `.now/` (папка)
- ❌ Переменных окружения с `NOW_` префиксом

## Готово!

После выполнения этих шагов конфликт должен быть устранен, и деплой на Vercel должен пройти успешно.
