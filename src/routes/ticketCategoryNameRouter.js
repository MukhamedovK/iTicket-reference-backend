const router = require("express").Router();

const { crudCreator } = require("../controllers/crudController");
const authMiddleware = require("../middleware/authMiddleware");
const ticketCategoryNameModel = require("../models/ticketCategoryNameModel");

const ticketCategoryNameController = crudCreator(ticketCategoryNameModel, {
  useLang: true,
});

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketCategoryName:
 *       type: object
 *       properties:
 *         name:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               description: English name of the ticket category
 *               example: "Premium"
 *             ru:
 *               type: string
 *               description: Russian name of the ticket category
 *               example: "Премиум"
 *             uz:
 *               type: string
 *               description: Uzbek name of the ticket category
 *               example: "Premium"
 *       required:
 *         - name
 */

/**
 * @swagger
 * tags:
 *   name: TicketCategoryNames
 *   description: API for managing ticket category names
 */

/**
 * @swagger
 * /api/v1/ticket-category-names:
 *   get:
 *     summary: Get all ticket category names
 *     tags: [TicketCategoryNames]
 *     parameters:
 *       - name: lang
 *         in: query
 *         description: The language to localize the response in
 *         required: false
 *         schema:
 *           type: string
 *           example: uz
 *     responses:
 *       200:
 *         description: A list of ticket category names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketCategoryName'
 *       500:
 *         description: Server error
 */
router.get("/", ticketCategoryNameController.getAll);

/**
 * @swagger
 * /api/v1/ticket-category-names/{id}:
 *   get:
 *     summary: Get a ticket category name by ID
 *     tags: [TicketCategoryNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket category ID
 *       - name: lang
 *         in: query
 *         description: The language to localize the response in
 *         required: false
 *         schema:
 *           type: string
 *           example: uz
 *     responses:
 *       200:
 *         description: A ticket category name object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketCategoryName'
 *       404:
 *         description: Ticket category not found
 *       500:
 *         description: Server error
 */
router.get("/:id", ticketCategoryNameController.getOne);

/**
 * @swagger
 * /api/v1/ticket-category-names:
 *   post:
 *     summary: Create a new ticket category name
 *     tags: [TicketCategoryNames]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketCategoryName'
 *     responses:
 *       201:
 *         description: Ticket category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketCategoryName'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, ticketCategoryNameController.create);

/**
 * @swagger
 * /api/v1/ticket-category-names/{id}:
 *   put:
 *     summary: Update a ticket category name
 *     tags: [TicketCategoryNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketCategoryName'
 *     responses:
 *       200:
 *         description: Ticket category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Ticket category not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, ticketCategoryNameController.update);

/**
 * @swagger
 * /api/v1/ticket-category-names/{id}:
 *   delete:
 *     summary: Delete a ticket category name
 *     tags: [TicketCategoryNames]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket category ID
 *     responses:
 *       200:
 *         description: Ticket category deleted successfully
 *       404:
 *         description: Ticket category not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, ticketCategoryNameController.remove);

module.exports = router;
