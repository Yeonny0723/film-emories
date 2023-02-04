import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { Response, Request } from "express";

export const home = (req: Request, res: Response) => {
  res.render("home", { pageTitle: "Home" });
};

export const getJoin = (req: Request, res: Response) =>
  res.render("join", { pageTitle: "Join" });

export const postJoin = async (req: Request, res: Response) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    req.flash("error", "Password confirmation does not match.");
    return res.status(400).render("join", {
      pageTitle,
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    req.flash("error", "This username/email is already taken.");
    return res.status(400).render("join", {
      pageTitle,
    });
  }
  try {
    await User.create({
      name,
      username,
      avatarUrl: "",
      email,
      password,
      location,
    });
    req.flash("info", "Try logging in with your new account!");
    return res.redirect("/login");
  } catch (error) {
    if (error instanceof Error) {
      req.flash("error", error.message);
    }
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
    });
  }
};

export const getLogin = (req: Request, res: Response) => {
  return res.render("login", {
    pageTitle: "Login",
  });
};

export const postLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    req.flash("error", "An account with this username does not exists.");
    return res.status(400).render("login", {
      pageTitle,
    });
  }
  const ok = await bcrypt.compare(password, user.password!);
  if (!ok) {
    req.flash("error", "Wrong password");
    return res.status(400).render("login", {
      pageTitle,
    });
  }
  req.flash("success", "We successfully logged you in.");
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req: Request, res: Response) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: "false",
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req: Request, res: Response) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code?.toString() || "",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email: any) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("success", "We logged you in!");
    return res.redirect("/");
  } else {
    req.flash("error", "Please try logging in manually.");
    return res.redirect("/login");
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.user = {};
  req.session.loggedIn = false;
  req.flash("success", "We logged you out");
  return res.redirect("/");
};

export const getEdit = (req: Request, res: Response) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req: any, res: Response) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  let existedEmail = await User.findOne({ email });
  let existedUsername = await User.findOne({ username });

  if (existedEmail) {
    if (existedEmail._id != _id) {
      req.flash("error", "Your email already exists");
      return res.render("edit-profile", {
        pageTitle: "Edit Profile",
      });
    }
  }
  if (existedUsername) {
    if (existedUsername._id != _id) {
      req.flash("error", "Username already exists");
      return res.render("edit-profile", {
        pageTitle: "Edit Profile",
      });
    }
  }

  const isHeroku = process.env.NODE_ENV;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      ...req.session.user,
      avatarUrl: file
        ? isHeroku
          ? (file as Express.MulterS3.File).location
          : file.path
        : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.flash("success", "Your profile is updated!");
  req.session.user = updatedUser || {};
  return res.redirect("/users/edit");
};

export const getChangePassword = (req: any, res: Response) => {
  if (req.session.user.socialOnly === true) {
    req.flash(
      "error",
      "You already have an account. Please login with Github."
    );
    return res.redirect("/");
  }
  req.flash("success", "Your password is changed!");
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req: any, res: Response) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user?.password || "");
  if (!ok) {
    req.flash("error", "The current password is incorrect");
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    req.flash("error", "The password does not match the confirmation");
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
    });
  }
  user!.password = newPassword;
  await user!.save();
  req.flash("info", "Password successfully updated");
  return res.redirect("/users/logout");
};

export const see = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};
