const router = require("express").Router();
const { filterEventByCategory } = require("../controllers/filterController");

/**
 * @swagger
 * /api/v1/events/filter-by-category:
 *   get:
 *     summary: Filter events by category
 *     description: Get a list of events filtered by category
 *     tags:
 *       - Events
 *     parameters:
 *       - name: category
 *         in: query
 *         description: The category ID of events to filter by
 *         required: true
 *         type: string
 *       - name: lang
 *         in: query
 *         description: The language to localize the response in
 *         required: false
 *         schema:
 *           type: string
 *           example: uz
 *     responses:
 *       200:
 *         description: A list of events filtered by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       404:
 *         description: Category does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful
 *                 message:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.get("/events/filter-by-category", filterEventByCategory);

module.exports = router;
