const route = require("express").Router();

// /**
//  * @swagger
//  * /test-api/:
//  *   get:
//  *     summary: Fetch a welcome message
//  *     description: Returns a welcome message
//  *     tags:
//  *       - "Welcome Messages"
//  *     responses:
//  *       200:
//  *         description: Successful response
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Welcome to the API
//  *   post:
//  *     summary: Create a welcome message
//  *     description: Adds a new welcome message
//  *     tags:
//  *       - "Welcome Messages"
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *                 example: New Welcome Message
//  *               content:
//  *                 type: string
//  *                 example: Hello! This is your welcome message.
//  *     responses:
//  *       201:
//  *         description: Message created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Welcome message created
//  * /test-api/{id}:
//  *   get:
//  *     summary: Fetch a specific welcome message
//  *     description: Returns a welcome message based on the provided ID
//  *     tags:
//  *       - "Welcome Messages"
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: The ID of the welcome message
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: lang
//  *         required: false
//  *         description: Language of the welcome message
//  *         schema:
//  *           type: string
//  *           example: en
//  *     responses:
//  *       200:
//  *         description: Successful response
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Welcome to the API
//  *   put:
//  *     summary: Update a welcome message
//  *     description: Updates a welcome message based on the provided ID
//  *     tags:
//  *       - "Welcome Messages"
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: The ID of the welcome message to update
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *                 example: Updated Welcome Message
//  *               content:
//  *                 type: string
//  *                 example: Updated content of the welcome message.
//  *     responses:
//  *       200:
//  *         description: Message updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Welcome message updated
//  * 
//  *   delete:
//  *     summary: Delete a welcome message
//  *     description: Deletes a welcome message based on the provided ID
//  *     tags:
//  *       - "Welcome Messages"
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: The ID of the welcome message to delete
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Message deleted successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Welcome message deleted
//  */


route.get("/", (req, res) => {
  res.json({ message: `Welcome to the API.` });
});

route.get("/:id", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;
  res.json({ message: `Welcome to the API. ID: ${id}, Language: ${lang || "default"}` });
});

route.post("/", (req, res) => {
  const { title, content } = req.body;
  res.status(201).json({ message: `Welcome message created: ${title} - ${content}` });
});

route.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  res.json({ message: `Welcome message updated. ID: ${id}, Title: ${title} - ${content}` });
});

route.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Welcome message deleted.` });
});


module.exports = route;
