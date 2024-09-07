// import module
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import multer, { diskStorage } from "multer";

const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"], // تم تعديل "image/jpg" إلى "image/jpeg"
  file: ["application/pdf", "application/msword"],
  video: ["video/mp4"],
};

export const cloudUploads = ({  allowFile = fileValidation.image }) => {
  const storage = diskStorage({});

  const fileFilter = (req, file, cb) => {
    console.log("File mimetype:", file.mimetype); // أضف log للتحقق من نوع الملف
    if (allowFile.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("invalid file format"), false);
  };

  return multer({ storage, fileFilter });
};
