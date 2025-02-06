const router = require("express").Router();
const areaModel = require("../models/areaModel");
const authMiddleware = require("../middleware/authMiddleware");
const { crudCreator } = require("../controllers/crudController");

const areaController = crudCreator(areaModel, {
  useLang: true,
  populateFields: [
    {
      path: "ticketCategory",
    },
  ],
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       properties:
 *         country:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               description: Country name in English
 *               example: "Uzbekistan"
 *             ru:
 *               type: string
 *               description: Country name in Russian
 *               example: "Узбекистан"
 *             uz:
 *               type: string
 *               description: Country name in Uzbek
 *               example: "O'zbekiston"
 *         city:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               description: City name in English
 *               example: "Tashkent"
 *             ru:
 *               type: string
 *               description: City name in Russian
 *               example: "Ташкент"
 *             uz:
 *               type: string
 *               description: City name in Uzbek
 *               example: "Toshkent"
 *         area:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               description: Area name in English
 *               example: "Theater of Muqimi"
 *             ru:
 *               type: string
 *               description: Area name in Russian
 *               example: "Театр Мукими"
 *             uz:
 *               type: string
 *               description: Area name in Uzbek
 *               example: "Muqimi teatri"
 *         hallName:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *               description: Hall name in English
 *               example: "hall-1"
 *             ru:
 *               type: string
 *               description: Hall name in Russian
 *               example: "зал-1"
 *             uz:
 *               type: string
 *               description: Hall name in Uzbek
 *               example: "zal-1"
 *         ticketCategory:
 *           type: array
 *           items:
 *             type: string
 *           description: Reference to seat ID
 *           example: ["64fa2d49b26a2f001c3d5d89"]
 *         lat:
 *           type: string
 *           description: Latitude coordinate
 *           example: "41.2995"
 *         lon:
 *           type: string
 *           description: Longitude coordinate
 *           example: "69.2401"
 *         phoneNumber:
 *           type: string
 *           description: Contact phone number
 *           example: "+998901234567"
 *       required:
 *         - city
 *         - hall
 *         - area
 *         - hallName
 *         - ticketCategory
 */

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: API for managing areas
 */

/**
 * @swagger
 * /api/v1/areas:
 *   get:
 *     summary: Get all areas
 *     tags: [Areas]
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
 *         description: A list of areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 *       500:
 *         description: Server error
 */
router.get("/", areaController.getAll);

/**
 * @swagger
 * /api/v1/areas/{id}:
 *   get:
 *     summary: Get an area by ID
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *       - name: lang
 *         in: query
 *         description: The language to localize the response in
 *         required: false
 *         schema:
 *           type: string
 *           example: uz
 *     responses:
 *       200:
 *         description: An area object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       404:
 *         description: Area not found
 *       500:
 *         description: Server error
 */
router.get("/:id", areaController.getOne);

/**
 * @swagger
 * /api/v1/areas:
 *   post:
 *     summary: Create a new area
 *     tags: [Areas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Area'
 *     responses:
 *       201:
 *         description: Area created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, areaController.create);

/**
 * @swagger
 * /api/v1/areas/{id}:
 *   put:
 *     summary: Update an area
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Area'
 *     responses:
 *       200:
 *         description: Area updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Area not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, areaController.update);

/**
 * @swagger
 * /api/v1/areas/{id}:
 *   delete:
 *     summary: Delete an area
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     responses:
 *       200:
 *         description: Area deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Area not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, areaController.remove);

module.exports = router;
