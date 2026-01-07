# Исправление проблемы запуска в Windows

## Проблема

Ошибка `spawn cmd.exe ENOENT` возникает при использовании `concurrently` в Windows PowerShell.

## Решения

### ✅ Решение 1: Использовать отдельные терминалы (рекомендуется)

Откройте **два терминала** и запустите:

**Терминал 1:**
```bash
cd dashboard
npm run dev:api
```

**Терминал 2:**
```bash
cd dashboard
npm run dev
```

### ✅ Решение 2: Использовать start.bat (только Windows)

Дважды кликните на файл `start.bat` или запустите:
```bash
start.bat
```

Это откроет два отдельных окна командной строки для API и Dashboard.

### ✅ Решение 3: Использовать новый скрипт start.js

```bash
npm run dev:all
```

Теперь использует Node.js скрипт вместо concurrently.

### ✅ Решение 4: Использовать Git Bash или WSL

Если у вас установлен Git Bash или WSL (Windows Subsystem for Linux):

```bash
# В Git Bash или WSL
npm run dev:all:concurrent
```

## Проверка работы

После запуска проверьте:

1. **API работает:** http://localhost:3000/api/health
2. **Dashboard работает:** http://localhost:3001

## Если ничего не помогает

Используйте **Решение 1** (отдельные терминалы) - это самый надежный способ в Windows.
