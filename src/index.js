require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const swaggerDocs = require("./config/SwaggerConfig");
const connectDB = require("./config/database");

const EventRouter = require("./routes/eventRouter");
const filterRouter = require("./routes/filterRouter");
const CategoryRouter = require("./routes/categoryRouter");
const UserRouter = require("./routes/userRouter");
const AuthRouter = require("./routes/authRouter");
const addsRouter = require("./routes/addsRouter");

const app = express();
const PORT = process.env.PORT || 8000;

// connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// CORS
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    origin: [
      "http://localhost:3000",
      "https://localhost:8000",
      "https://iticket-git-main-ai-ahmads-projects.vercel.app",
      "*",
    ],
  })
);

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/v1", AuthRouter);
app.use("/api/v1", filterRouter);
app.use("/api/v1/events", EventRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/adds", addsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
