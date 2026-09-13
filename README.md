# CITY QUEST — Тайны старой Москвы

Готовая статическая PWA-версия для GitHub Pages.

## Файлы
- `index.html` — точка входа
- `app.js` — логика квеста
- `styles.css` — интерфейс
- `manifest.webmanifest` — PWA
- `sw.js` — Service Worker
- `icon.svg` — иконка

## Запуск на GitHub Pages
1. Загрузите ВСЕ файлы из этой папки в корень репозитория.
2. GitHub → Settings → Pages.
3. Source: Deploy from a branch.
4. Branch: `main`, folder: `/(root)`.
5. Save.
6. Откройте опубликованный адрес GitHub Pages.

## Важно
В MVP кнопка «Открыть маршрут» не принимает реальные деньги — она только имитирует разблокировку.
Координаты точек являются рабочими координатами MVP и должны быть проверены на месте перед коммерческим запуском.
Карта использует OpenStreetMap через Leaflet CDN.
