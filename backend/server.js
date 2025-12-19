const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const preOpRoute = require("./routes/preop");
const intraOpRoute = require("./routes/intraop");
const postOpRoute = require("./routes/postop");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/preop", preOpRoute);
app.use("/api/intraop", intraOpRoute);
app.use("/api/postop", postOpRoute);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => res.send("CRUD Backend Running"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
