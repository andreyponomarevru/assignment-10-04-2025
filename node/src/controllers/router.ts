import Joi from "joi";
import express from "express";
import { validate } from "../middlewares/validate";
import {
  cancelAllPending,
  createRequest,
  deleteRequest,
  readRequests,
  moveToPending,
  moveFromPendingToFinished,
} from "./requests-controller";

export const requestsRouter = express.Router();

// Получить список обращений с возможность фильтрации по конкретной дате и по диапазону дат.
// Формат даты в реквесте: 2025-04-08 (year-month-day)
requestsRouter.get(
  "/",
  validate(
    Joi.object({
      date: Joi.string().isoDate().optional(),
      start: Joi.string().optional(),
      end: Joi.string().optional(),
    }).optional(),
    "query",
  ),
  readRequests,
);

// Создать обращение
requestsRouter.post(
  "/",
  validate(
    Joi.object({
      subject: Joi.string().max(100).optional(),
      message: Joi.string().max(400).optional(),
    }).optional(),
    "body",
  ),
  createRequest,
);

// Отмена обращения
requestsRouter.delete(
  "/:id",
  validate(
    Joi.object({
      id: Joi.number().positive().greater(0).required(),
      cancellation_reason: Joi.string().max(200).optional(),
    }),
    "params",
  ),
  deleteRequest,
);

// Отменить все обращения, которые находятся в статусе "в работе"
requestsRouter.delete("/statuses/pending", cancelAllPending);

// Взять обращение в работу (переместить из любого статуса в статус "в работе")
requestsRouter.post(
  "/:id/statuses/pending",
  validate(
    Joi.object({ id: Joi.number().positive().greater(0).required() }),
    "params",
  ),
  moveToPending,
);

// Завершить обработку обращения (переместить из "в работе" в "завершено")
requestsRouter.post(
  "/:id/statuses/finished",
  validate(
    Joi.object({
      id: Joi.number().positive().greater(0).required(),
    }),
    "params",
  ),
  moveFromPendingToFinished,
);
