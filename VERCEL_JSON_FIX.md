# Исправление vercel.json - конфликт builds и functions

## ✅ Проблема решена!

В `vercel.json` одновременно использовались `builds` и `functions`, что вызывает конфликт согласно документации Vercel.

## 🔧 Что было исправлено

### До (неправильно):
```json
{
  "version": 2,
  "builds": [                    ← Конфликт!
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "functions": {                  ← Конфликт!
    "api/index.js": {
      "maxDuration": 30
    }
  }
}
```

### После (правильно):
```json
{
  "version": 2,
  "functions": {                  ← Только functions
    "api/index.js": {
      "runtime": "@vercel/node",  ← Добавлен runtime
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

## 📝 Изменения

1. ✅ **Удален `builds`** - больше не используется
2. ✅ **Оставлен только `functions`** - современный подход
3. ✅ **Добавлен `runtime`** в `functions` - явно указывает runtime
4. ✅ **Сохранен `maxDuration`** - лимит времени выполнения

## 🚀 Следующие шаги

1. **Запушьте изменения:**
   ```bash
   cd dashboard
   git add vercel.json
   git commit -m "Fix vercel.json: remove builds, use only functions"
   git push
   ```

2. **Vercel автоматически передеплоит** после push

3. **Проверьте деплой:**
   - Должен пройти без ошибок
   - API должен работать: `https://safb-admin.vercel.app/api/health`

## 💡 Почему это важно

Согласно документации Vercel:
- ❌ **Нельзя использовать** `builds` и `functions` одновременно
- ✅ **Рекомендуется** использовать только `functions`
- ✅ **Преимущества** `functions`:
  - Более богатый набор функций
  - Настройка памяти
  - Большая надежность
  - "Clean URLs" по умолчанию

## ✅ Готово!

После этого исправления конфликт конфигураций должен быть устранен, и деплой должен пройти успешно.
