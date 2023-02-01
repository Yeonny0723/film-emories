import express from "express";
import { home, getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";
import { photobook, search } from "../controllers/videoController";
import { aboutUs } from "../controllers/globalController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/photobook", photobook);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);
rootRouter.get("/aboutUs", aboutUs);

export default rootRouter;