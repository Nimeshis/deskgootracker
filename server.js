const express = require("express");
const mongoose = require("mongoose");
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

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/deviceLocation", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", location);
// app.use("/api", login);
app.use("/api", Counter);
// app.use("/api", user);
app.use("/api", attendance);
app.use("/api", visitLog);
app.use("/api", countries);
app.use("/api", specialization);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
