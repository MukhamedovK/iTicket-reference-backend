const router = require("express").Router();

const ticketCategoryModel = require("../models/ticketCategoryModel");
const authMiddleware = require("../middleware/authMiddleware");
const { crudCreator } = require("../controllers/crudController");

const ticketCategoryController = crudCreator(ticketCategoryModel, {
  useLang: true,
  populateFields: [{ path: "ticketCategoryName" }],
});

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketCategory:
 *       type: object
 *       properties:
 *         ticketCategoryName:
 *           type: string
 *           description: Reference to TicketCategoryName ID
 *           example: "64fa2d49b26a2f001c3d5d88"
 *         price:
 *           type: number
 *           description: Price of the ticket category
 *           example: 100000
 *         area:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               sector:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Status of the sector
 *                     example: "available"
 *                   name:
 *                     type: object
 *                     properties:
 *                       en:
 *                         type: string
 *                         description: English name of the ticket category
 *                         example: "Parterre"
 *                       ru:
 *                         type: string
 *                         description: Russian name of the ticket category
 *                         example: "Партер"
 *                       uz:
 *                         type: string
 *                         description: Uzbek name of the ticket category
 *                         example: "Parter"
 *               status:
 *                 type: string
 *                 enum: ["available", "reserved", "sold"]
 *                 description: Ticket status
 *                 example: "reserved"
 *               row:
 *                 type: string
 *                 description: Row of the seat
 *                 example: "1"
 *               seat:
 *                 type: string
 *                 description: Seat number
 *                 example: "12"
 *       required:
 *         - ticketCategoryName
 *         - price
 *         - area
 */

/**
 * @swagger
 * tags:
 *   name: TicketCategories
 *   description: API for managing ticket categories
 */

/**
 * @swagger
 * /api/v1/ticket-categories:
 *   get:
 *     summary: Get all ticket categories
 *     tags: [TicketCategories]
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
 *         description: A list of ticket categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketCategory'
 *       500:
 *         description: Server error
 */
router.get("/", ticketCategoryController.getAll);

/**
 * @swagger
 * /api/v1/ticket-categories/{id}:
 *   get:
 *     summary: Get a ticket category by ID
 *     tags: [TicketCategories]
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
 *         description: A ticket category object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketCategory'
 *       404:
 *         description: Ticket category not found
 *       500:
 *         description: Server error
 */
router.get("/:id", ticketCategoryController.getOne);

/**
 * @swagger
 * /api/v1/ticket-categories:
 *   post:
 *     summary: Create a new ticket category
 *     tags: [TicketCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketCategory'
 *     responses:
 *       201:
 *         description: Ticket category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketCategory'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, ticketCategoryController.create);

/**
 * @swagger
 * /api/v1/ticket-categories/{id}:
 *   put:
 *     summary: Update a ticket category
 *     tags: [TicketCategories]
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
 *             $ref: '#/components/schemas/TicketCategory'
 *     responses:
 *       200:
 *         description: Ticket category updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket category not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, ticketCategoryController.update);

/**
 * @swagger
 * /api/v1/ticket-categories/{id}:
 *   delete:
 *     summary: Delete a ticket category
 *     tags: [TicketCategories]
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket category not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, ticketCategoryController.remove);

module.exports = router;
