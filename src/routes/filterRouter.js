const router = require("express").Router();
const { filterEvents } = require("../controllers/filterController");

/**
 * @swagger
 * /api/v1/events/filter-events:
 *   get:
 *     summary: Получить список событий с фильтрацией
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: ID категории события
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Начальная дата фильтрации событий (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Конечная дата фильтрации событий (YYYY-MM-DD)
 *       - in: query
 *         name: place
 *         schema:
 *           type: string
 *         description: Название места
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Минимальная цена билета
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Максимальная цена билета
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ru, uz]
 *         required: true
 *         description: Язык
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом событий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: object
 *                     properties:
 *                       en:
 *                         type: string
 *                       ru:
 *                         type: string
 *                       uz:
 *                         type: string
 *                   area:
 *                     type: string
 *                     description: ID локации
 *                     example: "60c72b2f5f1b2c001c8b9f63"
 *                   organization:
 *                     type: string
 *                   date:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           format: date-time
 *                         time:
 *                           type: object
 *                           properties:
 *                             start:
 *                               type: string
 *                             end:
 *                               type: string
 *                   category:
 *                     type: string
 *                     description: ID категории
 *                   is2D:
 *                     type: boolean
 *                     default: false
 *                   bannerImage:
 *                     type: string
 *                   cardImage:
 *                     type: array
 *                     items:
 *                       type: string
 *                   aboutEvent:
 *                     type: object
 *                     properties:
 *                       en:
 *                         type: string
 *                       ru:
 *                         type: string
 *                       uz:
 *                         type: string
 *                   ageAndLanguage:
 *                     type: object
 *                     properties:
 *                       age:
 *                         type: string
 *                       language:
 *                         type: object
 *                         properties:
 *                           en:
 *                             type: string
 *                           ru:
 *                             type: string
 *                           uz:
 *                             type: string
 *       400:
 *         description: Ошибка в запросе
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get("/events/filter-events", filterEvents);

module.exports = router;
