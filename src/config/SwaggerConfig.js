require('dotenv').config()
const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");

const PORT = process.env.PORT || 8000

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation iTicket project",
      version: "1.0.0",
      description: "Documentation for the backend APIs",
    },
    servers: [
      {
        url: "https://iticket-reference-backend.onrender.com",
      },
      {
        url: `http://localhost:${PORT}`
      }
    ],
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
