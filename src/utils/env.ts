import dotenv from "dotenv";
dotenv.config();

export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "897539643389373";
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "3B_09teXBspD49OxcI-gNCfqAS8";
export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "dbot4jz71";

export const DATABASE_URL: string =
  "mongodb+srv://krisnabmntr:PmqcA6ci98MJmsT3@belajar-backend-nodejs.vzey3tq.mongodb.net/?retryWrites=true&w=majority&appName=belajar-backend-nodejs";

export const SECRET: string = process.env.SECRET || "12345678901234567890123456789012";