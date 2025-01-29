const router = require("express").Router();

const { crudCreator } = require("../services/crudController");
const Calendar = require("../models/calendarModel");
const authMiddleware = require("../middleware/authMiddleware");

const calendarController = crudCreator(Calendar);

/**
 * @swagger
 * components:
 *   schemas:
 *     Calendar:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - time
 *         - address
 *         - date
 *       properties:
 *         title:
 *           type: string
 *           example: "Team Meeting"
 *         description:
 *           type: string
 *           example: "Monthly sync-up meeting with the team."
 *         time:
 *           type: object
 *           properties:
 *             start:
 *               type: string
 *               example: "10:00 AM"
 *             end:
 *               type: string
 *               example: "11:00 AM"
 *         address:
 *           type: string
 *           example: "123 Main Street, City"
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-08-15"
 */

/**
 * @swagger
 * /api/v1/calendar:
 *   get:
 *     summary: Get all calendar events
 *     description: Retrieves a list of all events.
 *     tags:
 *       - Calendar
 *     responses:
 *       200:
 *         description: Successfully retrieved events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Calendar'
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, calendarController.getAll);

/**
 * @swagger
 * /api/v1/calendar/{id}:
 *   get:
 *     summary: Get a calendar event by ID
 *     description: Retrieves a single calendar event based on its ID.
 *     tags:
 *       - Calendar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: Successfully retrieved the event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       404:
 *         description: Event not found
 */
router.get("/:id", authMiddleware, calendarController.getOne);

/**
 * @swagger
 * /api/v1/calendar:
 *   post:
 *     summary: Create a new calendar event
 *     description: Adds a new event to the calendar.
 *     tags:
 *       - Calendar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calendar'
 *     responses:
 *       201:
 *         description: Event successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       400:
 *         description: Bad request - Invalid data
 */
router.post("/", authMiddleware, calendarController.create);

/**
 * @swagger
 * /api/v1/calendar/{id}:
 *   put:
 *     summary: Update a calendar event
 *     description: Updates an existing calendar event by ID.
 *     tags:
 *       - Calendar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calendar'
 *     responses:
 *       200:
 *         description: Event successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       400:
 *         description: Bad request - Invalid data
 *       404:
 *         description: Event not found
 */
router.put("/:id", authMiddleware, calendarController.update);

/**
 * @swagger
 * /api/v1/calendar/{id}:
 *   delete:
 *     summary: Delete a calendar event
 *     description: Deletes a calendar event by ID.
 *     tags:
 *       - Calendar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to delete
 *     responses:
 *       200:
 *         description: Event successfully deleted
 *       404:
 *         description: Event not found
 */
router.delete("/:id", authMiddleware, calendarController.remove);

module.exports = router;