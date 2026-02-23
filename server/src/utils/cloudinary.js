import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// SAFE LOCAL FILE CLEANUP

const removeLocalFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    // ignore if file doesn't exist
  }
};

// SINGLE FILE UPLOAD

export const uploadSingle = async (
  localFilePath,
  { folder = "SmartCart/misc", resource_type = "auto" } = {}
) => {

  if (!localFilePath) {
    throw new Error("No file path provided for upload");
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type
    });

    await removeLocalFile(localFilePath);

    return {
      url: response.secure_url,
      public_id: response.public_id
    };

  } catch (error) {
    await removeLocalFile(localFilePath);
    throw new Error("Cloudinary upload failed");
  }
};

// MULTIPLE FILE UPLOAD

export const uploadMultiple = async (
  files,
  options = {}
) => {

  if (!files || files.length === 0) {
    throw new Error("No files provided for upload");
  }

  const uploaded = [];

  try {

    for (const file of files) {
      const result = await uploadSingle(file.path, options);
      uploaded.push(result);
    }

    return uploaded;

  } catch (error) {

    // rollback already uploaded files
    for (const file of uploaded) {
      await cloudinary.uploader.destroy(file.public_id);
    }

    throw new Error("Multiple upload failed. Rollback executed.");
  }
};

// DELETE SINGLE

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};

// DELETE MULTIPLE

export const deleteMultipleFromCloudinary = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) return;

  for (const id of publicIds) {
    await cloudinary.uploader.destroy(id);
  }
};