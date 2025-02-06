const Orders = require("../models/orderModel");

const sendEmail = require("../services/emailSender");
const { updateOrderStatus } = require("../bot");
// const { syncOrderWithAmoCRM } = require('../controllers/orderController')

const handlePaymeRequest = async (req, res) => {
  const { method } = req.body;

  switch (method) {
    case "CheckPerformTransaction":
      await checkPerform(req, res);
      break;
    case "CreateTransaction":
      await createTransaction(req, res);
      break;
    case "PerformTransaction":
      await performTransaction(req, res);
      break;
    case "CheckTransaction":
      await checkTransaction(req, res);
      break;
    case "CancelTransaction":
      await cancelTransaction(req, res);
      break;
    case "GetStatement":
      await getStatement(req, res);
      break;
    default:
      res.json({
        jsonrpc: "2.0",
        id: req.body.id || null,
        error: {
          code: -32601,
          message: {
            ru: "Метод не найден",
            uz: "Usul topilmadi",
            en: "Method not found",
          },
        },
      });
  }
};

const checkPerform = async (req, res) => {
  const { amount, account } = req.body.params || {};

  console.log("Received request in checkPerform:", req.body);

  if (!account || !account.orderId) {
    return res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -32504,
        message: {
          ru: "Заказ не найден",
          uz: "Zakaz topilmadi",
          en: "Order not found",
        },
        data: "orderId",
      },
    });
  }

  try {
    const order = await Orders.findById(account.orderId).populate("seats.seat");

    if (!order) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -31050,
          message: {
            ru: "Заказ не найден",
            uz: "Zakaz topilmadi",
            en: "Order not found",
          },
          data: "orderId",
        },
      });
    }

    const orderPriceInTiyin = order.amount * 100;

    if (orderPriceInTiyin !== amount) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -31001,
          message: {
            ru: "Неверная сумма",
            uz: "Noto‘g‘ri summa",
            en: "Incorrect amount",
          },
          data: "amount",
        },
      });
    }

    res.json({
      jsonrpc: "2.0",
      id: req.body.id,
      result: { allow: true },
    });
  } catch (error) {
    console.error("Error in checkPerform:", error);
    res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31099,
        message: {
          ru: "Ошибка на стороне сервера",
          uz: "Server tomonda xatolik",
          en: "Server error",
        },
        data: "server",
      },
    });
  }
};

const createTransaction = async (req, res) => {
  const { id, time, amount, account } = req.body.params || {};

  console.log("Received request in createTransaction:", req.body);

  if (!account || !account.orderId || !id || !time) {
    console.error("Required parameters are missing in the request:", req.body);
    return res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -32504,
        message: {
          ru: "Неверные параметры запроса",
          uz: "So‘rov parametrlari noto‘g‘ri",
          en: "Invalid request parameters",
        },
        data: "params",
      },
    });
  }

  try {
    const order = await Orders.findById(account.orderId);
    if (!order) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -31050,
          message: {
            ru: "Заказ не найден",
            uz: "Zakaz topilmadi",
            en: "Order not found",
          },
          data: "orderId",
        },
      });
    }

    const orderPriceInTiyin = order.amount * 100;

    if (orderPriceInTiyin !== amount) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -31001,
          message: {
            ru: "Неверная сумма",
            uz: "Noto‘g‘ri summa",
            en: "Incorrect amount",
          },
          data: "amount",
        },
      });
    }

    let transaction = await Orders.findOne({ transactionId: id });

    if (transaction) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        result: {
          create_time: transaction.create_time,
          transaction: transaction.transactionId,
          state: transaction.state,
        },
      });
    }

    let orderById = await Orders.findById(account.orderId);

    if (orderById?.transactionId && orderById?.transactionId !== id) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -31050,
          message: {
            ru: "Неверный идентификатор транзакции",
            uz: "Tranzaksiya identifikatori noto‘g‘ri",
            en: "Invalid transaction ID",
          },
          data: "id",
        },
      });
    }

    if (!orderById) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -31050,
          message: {
            ru: "Заказ не найден",
            uz: "Buyurtma topilmadi",
            en: "Order not found",
          },
          data: "invoiceNumber",
        },
      });
    }

    order.transactionId = id;
    order.create_time = time;
    order.amount = amount;
    order.state = 1;
    order.status = "ВЫСТАВЛЕНО";
    order.paymentType = "Payme";

    await order.save();

    res.json({
      jsonrpc: "2.0",
      id: req.body.id,
      result: {
        create_time: order.create_time,
        transaction: order.transactionId,
        state: order.state,
      },
    });
  } catch (error) {
    console.error("Error in createTransaction:", error);
    res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31099,
        message: {
          ru: "Ошибка на стороне сервера",
          uz: "Server tomonda xatolik",
          en: "Server error",
        },
        data: "server",
      },
    });
  }
};

const performTransaction = async (req, res) => {
  const { id } = req.body.params || {};

  console.log("Received request in performTransaction:", req.body);

  if (!id) {
    return res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31050,
        message: {
          ru: "Идентификатор транзакции отсутствует",
          uz: "Tranzaksiya identifikatori mavjud emas",
          en: "Transaction ID is missing",
        },
        data: "id",
      },
    });
  }

  try {
    let transaction = await Orders.findOne({ transactionId: id }).populate(
      "seats.seat"
    );

    if (!transaction) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -32504,
          message: {
            ru: "Транзакция не найдена",
            uz: "Tranzaksiya topilmadi",
            en: "Transaction not found",
          },
          data: "id",
        },
      });
    }

    if (transaction.state === 2) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        result: {
          transaction: transaction.transactionId,
          perform_time: transaction.perform_time,
          state: transaction.state,
        },
      });
    }

    transaction.state = 2;
    transaction.perform_time = Date.now();
    transaction.status = "ОПЛАЧЕНО";
    await transaction.save();

    updateOrderStatus(transaction);
    // await syncOrderWithAmoCRM(updatedOrder)

    await sendEmail(
      transaction.email,
      "TakeTicket.UZ - payment was successful!",
      "Siz chiptani muvoffaqiyatli sotib oldingiz!"
    );

    res.json({
      jsonrpc: "2.0",
      id: req.body.id,
      result: {
        transaction: transaction.transactionId,
        perform_time: transaction.perform_time,
        state: transaction.state,
      },
    });
  } catch (error) {
    console.error("Error in performTransaction:", error);
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31008,
        message: {
          ru: "Ошибка на стороне сервера",
          uz: "Server tomonda xatolik",
          en: "Server error",
        },
        data: "server",
      },
    });
  }
};

const checkTransaction = async (req, res) => {
  const { id } = req.body.params || {};

  console.log("Received request in checkTransaction:", req.body);

  if (!id) {
    return res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31050,
        message: {
          ru: "Идентификатор транзакции отсутствует",
          uz: "Tranzaksiya identifikatori mavjud emas",
          en: "Transaction ID is missing",
        },
        data: "id",
      },
    });
  }

  try {
    let transaction = await Orders.findOne({ transactionId: id });

    if (!transaction) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -32504,
          message: {
            ru: "Транзакция не найдена",
            uz: "Tranzaksiya topilmadi",
            en: "Transaction not found",
          },
          data: "id",
        },
      });
    }

    res.json({
      jsonrpc: "2.0",
      id: req.body.id,
      result: {
        create_time: transaction.create_time,
        perform_time: transaction.perform_time || 0,
        cancel_time: transaction.cancel_time || 0,
        transaction: transaction.transactionId,
        state: transaction.state,
        reason: transaction.reason || null,
      },
    });
  } catch (error) {
    console.error("Error in checkTransaction:", error);
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31008,
        message: {
          ru: "Ошибка на стороне сервера",
          uz: "Server tomonda xatolik",
          en: "Server error",
        },
        data: "server",
      },
    });
  }
};

const getStatement = async (req, res) => {
  const { from, to } = req.body.params || {};

  console.log("Received request in getStatement:", req.body);

  try {
    if (typeof from !== "number" || typeof to !== "number") {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id || null,
        error: {
          code: -31050,
          message: {
            ru: "Параметры запроса неверны",
            uz: "So‘rov parametrlari noto‘g‘ri",
            en: "Request parameters are invalid",
          },
          data: "params",
        },
      });
    }

    const transactions = await Orders.find({
      create_time: {
        $gte: from,
        $lte: to,
      },
    });

    if (!transactions || transactions.length === 0) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id || null,
        error: {
          code: -32504,
          message: {
            ru: "Транзакция не найдена",
            uz: "Tranzaksiya topilmadi",
            en: "Transaction not found",
          },
          data: null,
        },
      });
    }

    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.transactionId.toString(),
      time: transaction.create_time,
      amount: transaction.amount,
      account: {
        orderId: transaction._id,
      },
      create_time: transaction.create_time,
      perform_time: transaction.perform_time || 0,
      cancel_time: transaction.cancel_time || 0,
      state: transaction.state,
      reason: transaction.reason || null,
    }));

    res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      result: {
        transactions: formattedTransactions,
      },
    });
  } catch (error) {
    console.error("Ошибка в методе GetStatement:", error);
    res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31008,
        message: {
          ru: "Ошибка на стороне сервера",
          uz: "Server tomonda xatolik",
          en: "Server error",
        },
        data: "server",
      },
    });
  }
};

const cancelTransaction = async (req, res) => {
  const { id, reason } = req.body.params || {};

  console.log("Received request in cancelTransaction:", req.body);

  if (!id) {
    return res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31050,
        message: {
          ru: "Идентификатор транзакции отсутствует",
          uz: "Tranzaksiya identifikatori mavjud emas",
          en: "Transaction ID is missing",
        },
        data: "id",
      },
    });
  }

  try {
    let transaction = await Orders.findOne({ transactionId: id });

    if (!transaction) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -32504,
          message: {
            ru: "Транзакция не найдена",
            uz: "Tranzaksiya topilmadi",
            en: "Transaction not found",
          },
          data: "id",
        },
      });
    }

    if (transaction.state === 1) {
      transaction.state = -1;
      transaction.cancel_time = Date.now();
      transaction.reason = reason || null;
      transaction.status = "ОТМЕНЕНО";
      await transaction.save();
    } else if (transaction.state === 2) {
      transaction.state = -2;
      transaction.cancel_time = Date.now();
      transaction.reason = reason || null;
      transaction.status = "ОТМЕНЕНО";
      await transaction.save();
    } else if (transaction.state < 0) {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        result: {
          transaction: transaction.transactionId,
          cancel_time: transaction.cancel_time,
          state: transaction.state,
        },
      });
    } else {
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: {
          code: -31007,
          message: {
            ru: "Неверное состояние транзакции",
            uz: "Noto‘g‘ri tranzaksiya holati",
            en: "Invalid transaction state",
          },
          data: "state",
        },
      });
    }

    res.json({
      jsonrpc: "2.0",
      id: req.body.id,
      result: {
        transaction: transaction.transactionId,
        cancel_time: transaction.cancel_time,
        state: transaction.state,
      },
    });
  } catch (error) {
    console.error("Error in cancelTransaction:", error);
    res.json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -31008,
        message: {
          ru: "Ошибка на стороне сервера",
          uz: "Server tomonda xatolik",
          en: "Server error",
        },
        data: "server",
      },
    });
  }
};

module.exports = { handlePaymeRequest };
