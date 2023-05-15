const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/question", require("./routes/question"));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
