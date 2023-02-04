// import routers
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";

// import libraries for server
import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(logger);

app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // req, res를 json 객체 형태로

app.use(
  session({
    secret: (process.env.COOKIE_SECRET as string) || "",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL as string }),
  })
);

app.use(flash());

app.use(localsMiddleware);

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

app.use("/img", express.static("src/img"));

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
