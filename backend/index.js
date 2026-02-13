const authRoutes = require("./routes/authRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDatabase = require("./config/db");

dotenv.config();
connectDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("WasteZero API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
