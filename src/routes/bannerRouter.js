const router = require("express").Router();

const bannerModel = require("../models/bannerModel");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { crudCreator } = require("../controllers/crudController");

const bannerController = crudCreator(bannerModel, {
  useImages: true,
  imageFields: ["image"],
  imageFolder: "banners",
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - link
 *         - image
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the banner
 *         link:
 *           type: string
 *           description: The URL link for the banner
 *         image:
 *           type: string
 *           description: The URL of the uploaded image
 *       example:
 *         link: https://example.com
 *         image: /uploads/banner1.jpg
 */

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management API
 */

/**
 * @swagger
 * /api/v1/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 */
router.get("/", bannerController.getAll);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   get:
 *     summary: Get a banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner ID
 *     responses:
 *       200:
 *         description: Banner data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner not found
 */
router.get("/:id", bannerController.getOne);

/**
 * @swagger
 * /api/v1/banners:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banners]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - link
 *               - image
 *             properties:
 *               link:
 *                 type: string
 *                 description: The URL link for the banner
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       201:
 *         description: The banner was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       400:
 *         description: Bad request
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware("banners", [{ name: "image", maxCount: 1 }]),
  bannerController.create
);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               link:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The updated banner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner not found
 */
router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware("banners", [{ name: "image", maxCount: 1 }]),
  bannerController.update
);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 */
router.delete("/:id", authMiddleware, bannerController.remove);

module.exports = router;
