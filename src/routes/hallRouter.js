const router = require("express").Router();
const hallModel = require("../models/hallModel");
const authMiddleware = require("../middleware/authMiddleware");
const { crudCreator } = require("../controllers/crudController");

const hallController = crudCreator(hallModel, {
  useLang: true,
  populateFields: [
    { path: "ticketCategory", populate: { path: "ticketCategoryName" } },
  ],
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Hall:
 *       type: object
 *       properties:
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
 *           properties:
 *             type: string
 *             description: Reference to TicketCategory ID
 *             example: "64fa2d49b26a2f001c3d5d89"
 *       required:
 *         - area
 *         - hallName
 *         - ticketCategory
 */

/**
 * @swagger
 * tags:
 *   name: Halls
 *   description: API for managing halls
 */

/**
 * @swagger
 * /api/v1/halls:
 *   get:
 *     summary: Get all halls
 *     tags: [Halls]
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
 *         description: A list of halls
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hall'
 *       500:
 *         description: Server error
 */
router.get("/", hallController.getAll);

/**
 * @swagger
 * /api/v1/halls/{id}:
 *   get:
 *     summary: Get a hall by ID
 *     tags: [Halls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hall ID
 *       - name: lang
 *         in: query
 *         description: The language to localize the response in
 *         required: false
 *         schema:
 *           type: string
 *           example: uz
 *     responses:
 *       200:
 *         description: A hall object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hall'
 *       404:
 *         description: Hall not found
 *       500:
 *         description: Server error
 */
router.get("/:id", hallController.getOne);

/**
 * @swagger
 * /api/v1/halls:
 *   post:
 *     summary: Create a new hall
 *     tags: [Halls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hall'
 *     responses:
 *       201:
 *         description: Hall created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hall'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, hallController.create);

/**
 * @swagger
 * /api/v1/halls/{id}:
 *   put:
 *     summary: Update a hall
 *     tags: [Halls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hall ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hall'
 *     responses:
 *       200:
 *         description: Hall updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hall not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, hallController.update);

/**
 * @swagger
 * /api/v1/halls/{id}:
 *   delete:
 *     summary: Delete a hall
 *     tags: [Halls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hall ID
 *     responses:
 *       200:
 *         description: Hall deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hall not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, hallController.remove);

module.exports = router;
