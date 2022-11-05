import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";

const s3 = new aws.S3({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})

const isHeroku = process.env.NODE_ENV;
// const isHeroku = "Production" // Local

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "film-emories/images",
  acl: 'public-read',
  });

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "film-emories/videos",
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE, // ios 재생 가능
  });


export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.current_url = req.path;
    res.locals.siteName = "Film-emories";
    res.locals.loggedInUser = req.session.user || {};
    res.locals.isHeroku = isHeroku;
    next();
  };

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Please login first!");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "You are not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    filesize: 10000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
})
