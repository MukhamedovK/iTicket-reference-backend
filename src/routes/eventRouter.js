const router = require("express").Router();

const eventModel = require("../models/eventModel");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const { crudCreator } = require("../controllers/crudController");

const eventController = crudCreator(eventModel, {
  useLang: true,
  useImages: true,
  imageFields: ["bannerImage", "cardImage"],
  imageFolder: "events",
  populateFields: [
    { path: "category" },
    {
      path: "area",
      populate: {
        path: "hall",
        populate: {
          path: "ticketCategory"
        },
      },
    },
  ],
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         title:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             ru:
 *               type: string
 *             uz:
 *               type: string
 *           required:
 *             - uz
 *         area:
 *           type: string
 *           description: ID of the area
 *           example: "60c72b2f5f1b2c001c8b9f63"
 *         organization:
 *           type: string
 *         date:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               time:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                   end:
 *                     type: string
 *         category:
 *           type: string
 *           description: Category ID
 *         is2D:
 *           type: boolean
 *           default: false
 *         bannerImage:
 *           type: string
 *         cardImage:
 *           type: array
 *           items:
 *             type: string
 *         aboutEvent:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             ru:
 *               type: string
 *             uz:
 *               type: string
 *         ageAndLanguage:
 *           type: object
 *           properties:
 *             age:
 *               type: string
 *             language:
 *               type: object
 *               properties:
 *                 en:
 *                   type: string
 *                 ru:
 *                   type: string
 *                 uz:
 *                   type: string
 *       required:
 *         - title
 *         - area
 *         - date
 *         - category
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management
 */

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
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
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/", eventController.getAll);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *       - name: lang
 *         in: query
 *         description: The language to localize the response in
 *         required: false
 *         schema:
 *           type: string
 *           example: uz
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get("/:id", eventController.getOne);

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created
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
  eventController.create
);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware("events", [
    { name: "bannerImage", maxCount: 1 },
    { name: "cardImage", maxCount: 5 },
  ]),
  eventController.update
);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted
 *       404:
 *         description: Event not found
 */
router.delete("/:id", authMiddleware, eventController.remove);

module.exports = router;
