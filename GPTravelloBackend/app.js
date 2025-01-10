const express = require("express");
require("dotenv").config();
const logger = require("./middlewares/Logger");
const error = require("./middlewares/error");
const connectToDb = require("./config/db");
const cors = require("cors");
const path = require("path");
// Connect to database
connectToDb();

// Initialize Express app
const app = express();
app.use(express.static(path.join(__dirname,"images")))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use CORS middleware
app.use(cors());

// Use logger middleware
app.use(logger);

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/password"));
app.use("/api", require("./routes/trips"));
app.use("/api", require("./routes/hotels"));
app.use("/api", require("./routes/Booking"));
app.use("/api",require("./routes/server"))

// Error handling middleware
app.use(error.notFound);
app.use(error.errorHandler);

// Run the server
const port = process.env.PORT || 5001;
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
