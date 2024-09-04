// config/multerConfig.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Specify the folder where images will be stored
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage });

export default upload;
