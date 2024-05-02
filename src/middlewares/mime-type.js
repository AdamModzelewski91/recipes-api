const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

/* const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "photos");
  },
  filename: (req, file, cb) => {
    const noNamesSpaces = file.originalname
      .toLocaleLowerCase()
      .split(" ")
      .join("-");
    const noNamesExt = noNamesSpaces.split(".").slice(0, -1).join(".");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, noNamesExt + "-" + Date.now() + "." + ext);
  },
}); */

const storage = multer.memoryStorage();

exports.MimeType = multer({ storage: storage }).array("photos", 5);
