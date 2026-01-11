# Исправление ошибки runtime в vercel.json

## ❌ Ошибка

```
Error: Function Runtimes must have a valid version, for example now-php@1.0.0
```

## 🔍 Причина

В `vercel.json` был указан `runtime: "@vercel/node"` без версии, что вызывает ошибку.

## ✅ Решение

Для файлов в папке `api/` Vercel **автоматически определяет** runtime (Node.js), поэтому указывать его не нужно.

### Исправленный vercel.json:

```json
{
  "version": 2,
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

## 📝 Что изменилось

- ❌ **Удален** `"runtime": "@vercel/node"` - не нужен для файлов в `api/`
- ✅ **Оставлен** только `maxDuration: 30` - лимит времени выполнения

## 🚀 Следующие шаги

1. **Запушьте исправление:**
   ```bash
   cd dashboard
   git add vercel.json
   git commit -m "Fix vercel.json: remove runtime, let Vercel auto-detect"
   git push
   ```

2. **Проверьте деплой:**
   - Должен пройти успешно
   - API должен работать: `https://safb-admin.vercel.app/api/health`

## 💡 Почему это работает

- Файлы в папке `api/` автоматически обрабатываются как serverless functions
- Vercel определяет runtime по расширению файла (`.js` = Node.js)
- Указывать `runtime` нужно только для специальных случаев (Python, PHP, и т.д.)

## ✅ Готово!

После этого исправления деплой должен пройти успешно без ошибок о runtime.
