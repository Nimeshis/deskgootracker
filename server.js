const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const location = require("./routes/locationRoute");
const login = require("./routes/loginRoute");
const Counter = require("./routes/counterRoute");
const user = require("./routes/userRoute");
const attendance = require("./routes/attendanceRoute");
const visitLog = require("./routes/VisitLogRoute");
const countries = require("./routes/countryRoute");
const specialization = require("./routes/specializationRoute");
const poc = require("./routes/pocRoute");
const authenticate = require("./middleware/authenticationToken");

// Connect to MongoDB
connectDB();
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Routes that do NOT require authentication
app.use("/api", login);
app.use("/api", countries);
app.use("/api", location);
app.use("/api", user);
app.use("/api", specialization);
app.use("/api", Counter);

// Routes that DO require authentication
app.use("/api", authenticate, attendance);
app.use("/api", authenticate, visitLog);
app.use("/api", authenticate, poc);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server listening
const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
