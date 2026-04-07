// This module provides utility functions for handling file uploads and deletions with Cloudinary. It includes functions for uploading single and multiple files, as well as deleting files from Cloudinary using their public IDs. The module also ensures that local temporary files are cleaned up after the upload process, whether it succeeds or fails, to prevent cluttering the server's file system.

import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to remove a local file, used for cleanup after uploads
const removeLocalFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {}
};

// This function uploads a single file to Cloudinary. It takes the local file path and optional parameters for folder and resource type. After uploading, it removes the local file and returns the URL and public ID of the uploaded file. If the upload fails, it also ensures that the local file is removed to prevent orphaned files on the server.
export const uploadSingle = async (
  localFilePath,
  { folder = "SmartCart/misc", resource_type = "auto" } = {},
) => {
  if (!localFilePath) {
    throw new Error("No file path provided for upload");
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type,
    });

    await removeLocalFile(localFilePath);

    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    await removeLocalFile(localFilePath);
    throw new Error("Cloudinary upload failed");
  }
};

// This function uploads multiple files to Cloudinary. It takes an array of local file paths and optional parameters for folder and resource type. It attempts to upload each file and collects the results. If any upload fails, it rolls back by deleting any files that were successfully uploaded before the failure, ensuring that there are no orphaned files on Cloudinary.
export const uploadMultiple = async (files, options = {}) => {
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
    for (const file of uploaded) {
      await cloudinary.uploader.destroy(file.public_id);
    }

    throw new Error("Multiple upload failed. Rollback executed.");
  }
};

// This function deletes a file from Cloudinary using its public ID. If the public ID is not provided, it simply returns without performing any action. This is useful for cleaning up files that are no longer needed or for rolling back uploads in case of errors.
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};

// This function deletes multiple files from Cloudinary using an array of public IDs. It iterates through the list of public IDs and calls the delete function for each one. This is useful for batch deletions, such as when rolling back multiple uploads or cleaning up a set of files.
export const deleteMultipleFromCloudinary = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) return;

  for (const id of publicIds) {
    await cloudinary.uploader.destroy(id);
  }
};
