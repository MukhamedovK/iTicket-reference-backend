require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerDocs = require("./config/SwaggerConfig");
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 8000;

// connect to database
connectDB();

// Middleware
app.use(express.json());

// CORS
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    origin: ["http://localhost:3000"],
  })
);

// routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
