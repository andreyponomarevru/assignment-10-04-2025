# API

* `POST /api/requests` — Создать обращение
  ```shell
  curl \
    --request POST \
    --header 'content-type: application/json' \
    --data '{"subject": "Тема обращения", "message": "Текст обращения"}' \
    --url "localhost:8080/api/requests"
  ```
  
* `GET /api/requests` — Получить список обращений с возможность фильтрации
  ```shell
  # Без фильтра, возвращает все обращения кроме тех, что в статусе "Отменено"
  curl \
    --request GET \
    --url "localhost:8080/api/requests"
    
  # Фильтр по дате
  curl \
    --request GET \
    --url "localhost:8080/api/requests?date=2025-04-08"
  
  # Филтр по интервалу дат
  curl \
    --request GET \
    --url "localhost:8080/api/requests?start=2018-01-01&end=2025-01-01"
  ```

* `DELETE /api/requests/:id` — Отмена обращения (переместить из любого статуса в статус "отменено")
  ```shell
  curl \
    --request DELETE \
    --url "localhost:8080/api/requests/1"
    
  curl \
    --request DELETE \
    --header 'content-type: application/json' \
    --data '{"cancellation_reason":"Причина отмены"}' \
    --url "localhost:8080/api/requests/1"
  ```

* `DELETE /api/requests/statuses/pending` — Отменить все обращения, которые находятся в статусе "в работе" (переместить из статуса "в работе" в статус "отменено")
  ```shell
  curl \
    --request DELETE \
    --url "localhost:8080/api/requests/statuses/pending"
  ```
  
* `POST /api/requests/:id/statuses/pending` — Взять обращение в работу (переместить из любого статуса в статус "в работе")
  ```shell
  curl \
    --request POST \
    --url "localhost:8080/api/requests/1/statuses/pending"
  ```
  
* `POST /api/requests/:id/statuses/finished` — Завершить обработку обращения (переместить из статуса "в работе" в "завершено")
  ```shell
  curl \
    --request POST \
    --header 'content-type: application/json' \
    --data '{"response":"Решение проблемы"}' \
    --url "localhost:8080/api/requests/3/statuses/finished"
  ```

