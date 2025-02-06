const router = require("express").Router();
const { crudCreator } = require("../controllers/crudController");
const orderModel = require("../models/orderModel");

const orderController = crudCreator(orderModel, {
  populateFields: [{ path: "user" }, { path: "seats.seat" }],
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: ID заказа
 *         user:
 *           type: string
 *           description: ID пользователя
 *         seats:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               eventTitle:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   ru:
 *                     type: string
 *                   uz:
 *                     type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               cardImage:
 *                 type: string
 *               seat:
 *                 type: string
 *                 description: ID места
 *       example:
 *         user: "60c72b2f5f1b2c001c8e4d3b"
 *         seats:
 *           - eventTitle:
 *               en: "Concert"
 *               ru: "Концерт"
 *               uz: "Kontsert"
 *             date: "2024-02-06"
 *             startTime: "2024-02-06T18:00:00Z"
 *             cardImage: "https://example.com/image.jpg"
 *             seat: "60c72b2f5f1b2c001c8e4d3c"
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API для управления заказами
 */

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Добавить место в заказ
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventTitle:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   ru:
 *                     type: string
 *                   uz:
 *                     type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               cardImage:
 *                 type: string
 *               seat:
 *                 type: string
 *                 description: ID места
 *     responses:
 *       200:
 *         description: Место добавлено в заказ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Заказ не найден
 */
router.put("/:id", async (req, res) => {
  const { eventTitle, date, startTime, cardImage, seat } = req.body;
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    order.seats.push({ eventTitle, date, startTime, cardImage, seat });
    order.amount = order.seats.reduce((sum, s) => sum + (s.seat.price || 0), 0);

    await order.save();

    res.status(200).json(order.populate("seats.seat"));
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/v1/orders/{id}/remove-seat/{seatId}:
 *   put:
 *     summary: Remove a seat from an order
 *     description: Deletes a seat from the order's seats array by seat ID and updates the total amount.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order.
 *         schema:
 *           type: string
 *       - in: path
 *         name: seatId
 *         required: true
 *         description: The ID of the seat to remove.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat removed successfully, and the order amount is updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id/remove-seat/:seatId", async (req, res) => {
  try {
    const { id, seatId } = req.params;

    const order = await orderModel.findById(id).populate("seats.seat");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedSeats = order.seats.filter((s) => s._id.toString() !== seatId);

    const newAmount = updatedSeats.reduce(
      (sum, s) => sum + (s.seat.price || 0),
      0
    );

    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      {
        $pull: { seats: { _id: seatId } },
        $set: { amount: newAmount },
      },
      { new: true }
    );

    res.status(200).json(updatedOrder.populate("seats.seat"));
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/v1/orders/by-user/{id}:
 *   get:
 *     summary: Получить заказы по пользователю
 *     description: Возвращает список заказов для пользователя по его ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя, для которого нужно получить заказы.
 *     responses:
 *       200:
 *         description: Список заказов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get("/by-user/:id", async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.params.id })
      .populate("seats.seat");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Получить список всех заказов
 *     description: Возвращает список всех заказов с возможностью указания языка для перевода названий событий.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Список заказов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", orderController.getAll);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Получить заказ по ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Заказ найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Заказ не найден
 */
router.get("/:id", orderController.getOne);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Создать новый заказ
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Заказ создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post("/", orderController.create);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Удалить заказ по ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Заказ удалён
 *       404:
 *         description: Заказ не найден
 */
router.delete("/:id", orderController.remove);

module.exports = router;
