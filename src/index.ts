import express from "express";
import { userRoutes } from "./routes/user.routes";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes());

app.listen(process.env.PORT, () => {
  console.log("API está rodando na porta 4444!");
});
