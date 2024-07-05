import express from "express";
import apiRouter from "./routes/api.js";
import connection from "./connection.js";
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "404_NOT_FOUND" });
});

// MongoDB Connection
connection();

app.listen(3000, () => {
  console.log("server started on port 3000");
});
