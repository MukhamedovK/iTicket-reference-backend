const router = require("express").Router();

const authModel = require("../models/authModel");
const authMiddleware = require("../middleware/authMiddleware");
const { filterUsersByRole } = require("../controllers/filterController");
const { crudCreator } = require("../controllers/crudController");

const authController = crudCreator(authModel);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user
 *         password:
 *           type: string
 *           description: The password of the user (hashed)
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: The role of the user
 *         birthDate:
 *           type: string
 *           format: date
 *           description: The birth date of the user
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: The gender of the user
 *         country:
 *           type: string
 *           description: The country of the user
 *         orders:
 *           type: array
 *           description: Orders list of the user
 *         address:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: The title of the users' address
 *             street:
 *               type: string
 *               description: The street of the users' address
 *             building:
 *               type: string
 *               description: The building of the users' address
 *             apartment:
 *               type: string
 *               description: The apartment of the users' address
 *             postalCode:
 *               type: string
 *               description: The postalCode of the users' address
 *             country:
 *               type: string
 *               description: The country of the users' address
 *             city:
 *               type: string
 *               description: The city of the users' address
 *             additionalInfo:
 *               type: string
 *               description: The additionalInfo of the users' address
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - password
 *         - role
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", authMiddleware, authController.getAll);

/**
 * @swagger
 * /api/v1/users/get-by-role:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: true
 *         description: The user role (admin, user)
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/get-by-role", authMiddleware, filterUsersByRole);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/:id", authMiddleware, authController.getOne);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.put("/:id", authMiddleware, authController.update);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", authMiddleware, authController.remove);

module.exports = router;
