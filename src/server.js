import express from "express";
import userroute from "./routes/userroute.js";
import taskroute from "./routes/taskroute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", userroute);
app.use("/task", taskroute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running..${PORT}`);
});
