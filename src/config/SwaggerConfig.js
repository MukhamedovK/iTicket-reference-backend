// swaggerConfig.js
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation Iticket projects",
      version: "1.0.0",
      description: "Documentation for the backend APIs",
    },
    servers: [
      {
        url: "https://iticket-reference-backend.onrender.com", // Replace with your API server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to API documentation comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
