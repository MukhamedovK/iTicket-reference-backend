const express = require("express");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const swaggerDocs = require("./config/SwaggerConfig");
const connectDB = require("./config/database")

const app = express();
const PORT = 9000;


// connect to database 
connectDB()

// Middleware
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
