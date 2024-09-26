import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ["jpeg", "png", "jpg"],
    },
  });
};

// Export as default
const uploadConfig = {
  uploadProductImages: multer({ storage: createStorage("products") }),
  uploadBoardImages: multer({ storage: createStorage("boards") }),
};

export default uploadConfig;
