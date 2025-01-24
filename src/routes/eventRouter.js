const express = require("express");
const router = express.Router();
const {
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - location
 *         - events
 *         - category
 *         - bannerImage
 *         - cardImage
 *       properties:
 *         name:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               description: Event name in English
 *             ru:
 *               type: string
 *               description: Event name in Russian
 *             uz:
 *               type: string
 *               description: Event name in Uzbek (required)
 *         price:
 *           type: object
 *           properties:
 *             minPrice:
 *               type: number
 *               description: Minimum price of event
 *             maxPrice:
 *               type: number
 *               description: Maximum price of event
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: string
 *               description: Latitude of the venue
 *             longitude:
 *               type: string
 *               description: Longitude of the venue
 *             venueName:
 *               type: object
 *               properties:
 *                 en:
 *                   type: string
 *                   description: Venue name in English
 *                 ru:
 *                   type: string
 *                   description: Venue name in Russian
 *                 uz:
 *                   type: string
 *                   description: Venue name in Uzbek (required)
 *             address:
 *               type: object
 *               properties:
 *                 en:
 *                   type: string
 *                   description: Address in English
 *                 ru:
 *                   type: string
 *                   description: Address in Russian
 *                 uz:
 *                   type: string
 *                   description: Address in Uzbek (required)
 *             phoneNumber:
 *               type: string
 *               description: Phone number of the venue
 *         events:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: Event name in English
 *                   ru:
 *                     type: string
 *                     description: Event name in Russian
 *                   uz:
 *                     type: string
 *                     description: Event name in Uzbek
 *               venueName:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: Venue name in English
 *                   ru:
 *                     type: string
 *                     description: Venue name in Russian
 *                   uz:
 *                     type: string
 *                     description: Venue name in Uzbek
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Event date
 *               time:
 *                 type: object
 *                 properties:
 *                   startTime:
 *                     type: string
 *                     description: Event start time
 *                   endTime:
 *                     type: string
 *                     description: Event end time
 *         category:
 *           type: string
 *           description: Category ID of the event
 *         is2D:
 *           type: boolean
 *           description: Whether the event is in 2D (optional)
 *         bannerImage:
 *           type: string
 *           description: Banner image
 *         cardImage:
 *           type: array
 *           items:
 *             type: string
 *           description: Card images
 *         aboutEvent:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               description: Description in English
 *             ru:
 *               type: string
 *               description: Description in Russian
 *             uz:
 *               type: string
 *               description: Description in Uzbek
 *         ageAndLanguage:
 *           type: object
 *           properties:
 *             age:
 *               type: string
 *               description: Age restriction
 *             language:
 *               type: object
 *               properties:
 *                 en:
 *                   type: string
 *                   description: Language in English
 *                 ru:
 *                   type: string
 *                   description: Language in Russian
 *                 uz:
 *                   type: string
 *                   description: Language in Uzbek
 */

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all events
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: lang
 *         required: false
 *         description: Language of the categories
 *         schema:
 *           type: string
 *           example: uz
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/", getEvents);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Retrieve a single event by its ID
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Event ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: lang
 *         required: false
 *         description: Language of the categories
 *         schema:
 *           type: string
 *           example: uz
 *     responses:
 *       200:
 *         description: An event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.get("/:id", getEvent);

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     description: Add a new event to the database with optional file uploads for banner and card images.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware("events", [
    { name: "bannerImage", maxCount: 1 },
    { name: "cardImage", maxCount: 5 },
  ]),
  createEvent
);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   put:
 *     summary: Update an existing event
 *     description: Update an event in the database with optional file uploads for banner and card images.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the event to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware("events", [
    { name: "bannerImage", maxCount: 1 },
    { name: "cardImage", maxCount: 5 },
  ]),
  updateEvent
);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event by its ID
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Event ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted
 */
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;
