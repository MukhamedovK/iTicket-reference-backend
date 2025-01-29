const router = require("express").Router();
const { loginUser, registerUser } = require("../controllers/authController");

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Log in a user with email or phone number and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number (alternative to email).
 *               password:
 *                 type: string
 *                 description: User's password.
 *             example:
 *               email: "user@example.com"
 *               password: "Password123!"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing email or phone number.
 *       404:
 *         description: User not found.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name.
 *               lastName:
 *                 type: string
 *                 description: User's last name.
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number.
 *               password:
 *                 type: string
 *                 description: User's password.
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 description: User's role.
 *             example:
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "johndoe@example.com"
 *               phoneNumber: "1234567890"
 *               password: "password"
 *               role: "user"
 *     responses:
 *       201:
 *         description: Registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     newUser:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email or phone number already in use.
 *       500:
 *         description: Internal server error.
 */
router.post("/register", registerUser);

module.exports = router;
