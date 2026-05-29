import express from "express";
import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "@routes/auth.routes";
import { globalErrorHandler } from "@middleware/error-handler";
import notFound from "@middleware/not-found";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// app.use(helmet());
// app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use(notFound);
app.use(globalErrorHandler);

app.get("/", (_, res) => {
  res.send("API Running");
});

export default app;
