# Baikal Proxy

Современный веб-прокси сервис с красивым дизайном и функциональностью браузера.

## Особенности

- 🎨 Современный дизайн с градиентами и стеклянными эффектами
- 🔍 Поддержка популярных поисковых систем (DuckDuckGo, Google, Yandex, Bing)
- 📱 Адаптивный дизайн для всех устройств
- 🗂️ Система вкладок как в браузере
- 🔒 Безопасное проксирование веб-страниц
- ⚡ Быстрая загрузка и отзывчивый интерфейс

## Технологии

- Next.js 14 с App Router
- TypeScript
- Tailwind CSS
- Lucide React (иконки)

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите сервер разработки:
```bash
npm run dev
```

3. Откройте [http://localhost:3000](http://localhost:3000) в браузере

## Использование

1. Выберите поисковую систему из выпадающего списка
2. Введите URL сайта или поисковый запрос
3. Нажмите Enter или кнопку поиска
4. Используйте вкладки для работы с несколькими сайтами одновременно

## Развертывание

Проект готов для развертывания на Vercel, Netlify или любой другой платформе, поддерживающей Next.js.

## Безопасность

- Все запросы проходят через серверный API
- Применяются заголовки безопасности
- Iframe sandbox для изоляции контента
- CSP политики для защиты от XSS

## Лицензия

MIT License