import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { Request, Response } from "express";

export const photobook = async (req: Request, res: Response) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  console.log("***", videos);
  return res.render("photobook", { pageTitle: "Photobook", videos });
};

export const watch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req: any, res: Response) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the video owner!");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req: any, res: Response) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }).populate<{ owner: any }>(
    "owner"
  );
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner._id) !== String(_id)) {
    req.flash("error", "You are not the video owner");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Your change was saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req: Request, res: Response) => {
  const color_palette = [
    "FFA3A3",
    "FFB066",
    "E82A78",
    "FFEC73",
    "82BC33",
    "1E9A7D",
    "628CB3",
    "40486A",
    "5C60B4",
    "8A7C77",
    "4C4D56",
  ];
  return res.render("upload", { pageTitle: "Upload Video", color_palette });
};

export const postUpload = async (req: any, res: Response) => {
  const {
    body: { title, description, hashtags },
    files: { video, thumb },
    session: {
      user: { _id },
    },
  } = req;

  const isHeroku = process.env.NODE_ENV;

  try {
    const newVideo = await Video.create({
      title,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
      owner: _id,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user!.videos.push(newVideo.id);
    user!.save();
    req.flash("success", "Your photo was successfully saved!");
    return res.redirect("/photobook");
  } catch (error) {
    if (error instanceof Error) {
      req.flash("error", error.message);
    }
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
    });
  }
};

export const deleteVideo = async (req: any, res: Response) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  req.flash("error", "Video successfully deleted");
  return res.redirect("/photobook");
};

export const search = async (req: Request, res: Response) => {
  const { keyword } = req.query;
  let videos: any[] = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req: any, res: Response) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment.id);
  video.save();
  req.flash("success", "Comment deleted");
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req: any, res: Response) => {
  const comment_id = req.params.id;
  const loggedUser = req.session.user._id;
  const comment = await Comment.findById({ _id: comment_id }).populate<{
    owner: any;
  }>("owner");
  // check if user is an owner of the comment
  if (String(loggedUser) === String(comment!.owner._id)) {
    await Comment.deleteOne({ _id: comment_id });
    req.flash("success", "Comment deleted!");
    return res.status(201).end();
  } else {
    return res.status(403).end();
  }
};
