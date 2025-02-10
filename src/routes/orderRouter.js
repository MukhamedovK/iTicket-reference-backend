const router = require("express").Router();
const { crudCreator } = require("../controllers/crudController");
const orderModel = require("../models/orderModel");
const SeatModel = require("../models/SeatModel");

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
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               cardImage:
 *                 type: string
 *               seat:
 *                 type: string
 *                 description: ID места
 *       example:
 *         user: "60c72b2f5f1b2c001c8e4d3b"
 *         seats:
 *             eventTitle: "Global Women Forum"
 *             date: "2025-04-20"
 *             startTime: "10:00"
 *             cardImage: "https://api.taketicket.uz/uploads/events/global-women-forum.PNG"
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
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
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
  const {
    eventTitle = "Global Women Forum",
    date = new Date("2025-04-20"),
    startTime = "10:00",
    cardImage = `${process.env.DOMAIN}/uploads/events/global-women-forum.PNG`,
    seat,
  } = req.body;
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("seats.seat");
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    const seatId = await SeatModel.findOne({ seat_type: seat }).select("_id");

    order.seats.push({
      eventTitle,
      date,
      startTime,
      cardImage,
      seat: seatId._id,
    });
    order.amount = order.seats.reduce((sum, s) => sum + (s.seat.price || 0), 0);

    await order.save();

    res.status(200).json(order);
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

    const updatedSeats = order.seats.filter((s) => s.seat.seat_type !== seatId);

    const newAmount = updatedSeats.reduce(
      (sum, s) => sum + (s.seat.price || 0),
      0
    );

    const updatedOrder = await orderModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            seats: updatedSeats,
            amount: newAmount,
          },
        },
        { new: true }
      )
      .populate("seats.seat");

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [unpaid, paid]
 *         description: Статус заказа, оплаченные или в корзине.
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
  const { status } = req.query;
  try {
    const orderStatus = status === "paid" ? "ОПЛАЧЕНО" : "НЕ ОПЛАЧЕНО";
    const orders = await orderModel
      .find({ user: req.params.id, status: orderStatus })
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
