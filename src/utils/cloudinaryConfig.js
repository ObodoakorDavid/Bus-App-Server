import dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUNINARY_NAME,
  api_key: process.env.CLOUNINARY_API_KEY,
  api_secret: process.env.CLOUNINARY_API_SECRET,
});

export default cloudinary;
