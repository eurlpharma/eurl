import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Product from "../models/productModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    process.exit(1);
  });

const productsFolder = "/home/jini/Desktop/Healthy/server/uploads/products";

async function getProductFolders() {
  try {
    const folders = fs
      .readdirSync(productsFolder)
      .filter(
        (folder) =>
          fs.statSync(path.join(productsFolder, folder)).isDirectory() &&
          folder.startsWith("medical_device_")
      );
    return folders;
  } catch (error) {
    return [];
  }
}

function getImagesInFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath).filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
    });
    return files;
  } catch (error) {
    return [];
  }
}

async function updateProductImages() {
  try {
    const products = await Product.find({});
    const productFolders = await getProductFolders();

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      const productNumber =
        (Math.abs(
          parseInt(product._id.toString().replace(/[^0-9]/g, "") || "0")
        ) %
          productFolders.length) +
        1;
      const folderName = `medical_device_${productNumber}`;
      const folderPath = path.join(productsFolder, folderName);

      if (!fs.existsSync(folderPath)) {
        console.warn(
          `Folder ${folderPath} does not exist, skipping product ${product._id}`
        );
        continue;
      }

      const images = getImagesInFolder(folderPath);
      if (images.length === 0) {
        console.warn(
          `No images found in folder ${folderPath}, skipping product ${product._id}`
        );
        continue;
      }

      const newImages = images.map((image) => image);

      product.images = newImages;
      await product.save();
    }
  } catch (error) {
  } finally {
    mongoose.disconnect();
  }
}

updateProductImages();
