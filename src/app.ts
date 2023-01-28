import express from "express";
import cors from "cors";
import router from "./routes";
import apiRouter from "./routes/api";
import { ORIGIN as origin } from "./config";

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static("public"))
  .use(router)
  .use(
    cors({
      origin,
    })
  )
  .use("/api", apiRouter);

export default app;
