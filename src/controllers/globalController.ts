import { Request, Response } from "express";

export const aboutUs = (req: Request, res: Response) =>
  res.render("aboutUs", { pageTitle: "Home" });
