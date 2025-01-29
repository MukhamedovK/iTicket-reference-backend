const router = require("express").Router();

const addsModel = require("../models/addsModel");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { crudCreator } = require("../controllers/crudController");

const addController = crudCreator(addsModel, {
  useImages: true,
  imageFields: ["image"],
  imageFolder: "adds",
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Add:
 *       type: object
 *       required:
 *         - image
 *         - link
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the add
 *         image:
 *           type: string
 *           description: The URL or path of the image
 *         link:
 *           type: string
 *           description: The link associated with the add
 *       example:
 *         image: "uploads/image.jpg"
 *         link: "https://example.com"
 */

/**
 * @swagger
 * tags:
 *   name: Adds
 *   description: The Adds management API
 */

/**
 * @swagger
 * /api/v1/adds:
 *   get:
 *     summary: Get all adds
 *     tags: [Adds]
 *     responses:
 *       200:
 *         description: The list of all adds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Add'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", addController.getAll);

/**
 * @swagger
 * /api/v1/adds/{id}:
 *   get:
 *     summary: Get an add by ID
 *     tags: [Adds]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the add
 *     responses:
 *       200:
 *         description: The add data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Add'
 *       400:
 *         description: Add not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", addController.getOne);

/**
 * @swagger
 * /api/v1/adds:
 *   post:
 *     summary: Create a new add
 *     tags: [Adds]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Add created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Add'
 *       404:
 *         description: Image and link are required
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware("adds", [{ name: "image", maxCount: 1 }]),
  addController.create
);

/**
 * @swagger
 * /api/v1/adds/{id}:
 *   put:
 *     summary: Update an add by ID
 *     tags: [Adds]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the add
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Add updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Add'
 *       404:
 *         description: Image and link are required
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware("adds", [{ name: "image", maxCount: 1 }]),
  addController.update
);

/**
 * @swagger
 * /api/v1/adds/{id}:
 *   delete:
 *     summary: Delete an add by ID
 *     tags: [Adds]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the add
 *     responses:
 *       200:
 *         description: Add deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Add not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", authMiddleware, addController.remove);

module.exports = router;
