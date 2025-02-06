require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: false });

const GROUP_CHAT_ID_PENDING = "-4671797835";
const GROUP_CHAT_ID_PAID = "-4728546871";

const pendingMessageMap = new Map();

const sendOrderToBot = (orderData) => {
  console.log("Sending order data:", orderData);
  console.log("ORDER DATA IN BOT: ", orderData);

  const formattedAmount = new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(orderData.amount || 0);

  const statusSticker = orderData.status === "ОПЛАЧЕНО" ? "✅" : "🟡";

  const chatId =
    orderData.status === "ОПЛАЧЕНО"
      ? GROUP_CHAT_ID_PAID
      : GROUP_CHAT_ID_PENDING;

  let seatsInfo = "";
  orderData.seats.forEach((seat) => {
    const eventTitle = seat.eventTitle;
    const area = seat.seat.map_type ? seat.seat.map_type : "Не указана";
    const category = seat.seat.category ? seat.seat.category : "Не указана";
    const sector = seat.seat.sector ? seat.seat.sector : "Не указана";
    const row = seat.seat.row ? seat.seat.row : "Не указана";
    const seats = seat.seat.seat ? seat.seat.seat : "Не указана";
    const price = seat.seat.price ? seat.seat.price : "Не указана";

    seatsInfo += `
          🔸 <b>Мероприятие:</b> ${decodeURIComponent(eventTitle)}
          🔸 <b>Зал:</b> ${decodeURIComponent(area)}
          🔸 <b>Тип билета:</b> ${decodeURIComponent(category)}
          🔸 <b>Сектор:</b> ${decodeURIComponent(sector)}
          🔸 <b>Ряд:</b> ${decodeURIComponent(row)}
          🔸 <b>Место:</b> ${decodeURIComponent(seats)}
          🔸 <b>Цена:</b> ${new Intl.NumberFormat("ru-RU", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(price)} сум
          \n
        `;
  });

  const message = `
        🧾 <b>Заказ ${orderData._id}</b>:
        🔸 <b>Клиент:</b> ${orderData.user.firstName} ${orderData.user.lastName}
        🔸 <b>Телефон:</b> ${orderData.user.phoneNumber || "Не указан"}
        🔸 <b>Почта:</b> ${orderData.user.email || "Не указан"}
        ${statusSticker} <b>Статус:</b> ${orderData.status}
        🇺🇿 <b>Общая Сумма:</b> ${formattedAmount} сум
        ${seatsInfo}
      `;

  bot
    .sendMessage(chatId, message, { parse_mode: "HTML" })
    .then((sentMessage) => {
      console.log("Message sent successfully");

      if (orderData.status === "ВЫСТАВЛЕНО") {
        console.log(
          `Storing message ID ${sentMessage.message_id} for invoice ${orderData.invoiceNumber}`
        );
        pendingMessageMap.set(orderData.invoiceNumber, sentMessage.message_id);
      }
    })
    .catch((error) => {
      console.error("Error sending message to bot:", error);
    });
};

const updateOrderStatus = (orderData) => {
  if (orderData.status === "ОПЛАЧЕНО") {
    sendOrderToBot(orderData);

    const paidNotification = `
      ✅ <b>Заказ ${orderData._id || ""}</b> Оплачен
    `;

    bot
      .sendMessage(GROUP_CHAT_ID_PENDING, paidNotification, {
        parse_mode: "HTML",
      })
      .then(() => console.log("Paid notification sent to PENDING group"))
      .catch((error) =>
        console.error(
          "Error sending paid notification to PENDING group:",
          error
        )
      );
  } else {
    sendOrderToBot(orderData);
  }
};

module.exports = { bot, sendOrderToBot, updateOrderStatus };
