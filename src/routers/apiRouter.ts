import express from "express";
import { registerView, createComment, deleteComment } from "../controllers/videoController";

const apiRouter = express.Router();

// video api
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
// comment api
apiRouter.delete("/comments/:id([0-9a-f]{24})/delete", deleteComment);

export default apiRouter;