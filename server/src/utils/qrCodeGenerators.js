// This module provides utility functions for generating QR codes. It includes functions to create unique QR code data, generate QR code images in Data URL format, and generate and upload QR code images to a cloud storage service. The module uses the 'qrcode' library for QR code generation and includes error handling to ensure robust functionality. Additionally, it implements a cleanup mechanism to remove temporary files created during the QR code generation process, ensuring that the server's file system remains clean and efficient.

import QRCode from "qrcode";
import crypto from "crypto";
import { ApiError } from "./ApiError.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This function generates unique QR code data by creating a random hexadecimal string and appending a timestamp. The resulting string is formatted as "ORDER-{uniqueId}-{timestamp}", which can be used to encode order information in the QR code.
const generateQRCode = async () => {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const qrData = `ORDER-${uniqueId}-${timestamp}`;

  return qrData;
};

// This function generates a QR code image in Data URL format based on the provided order ID. It uses the 'qrcode' library to create a QR code with specific options for size, margin, and color. The generated QR code is returned as a Data URL, which can be easily embedded in web pages or sent to clients without needing to save it as a file.
const generateQRCodeImage = async (orderId) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(orderId, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return qrCodeDataURL;
  } catch (error) {
    throw new Error("Failed to generate QR code image");
  }
};

// This function generates a QR code image based on the provided data, saves it temporarily on the server, uploads it to a cloud storage service, and then cleans up the temporary file. It ensures that any errors during the process are properly handled and that temporary files are removed to prevent cluttering the server's file system. The function returns the URL of the uploaded QR code image, which can be used for further processing or sharing with clients.
const generateAndUploadQRCode = async (qrData) => {
  console.log("🔍 QR Data:", qrData);
  let tempPath;

  try {
    const qrBuffer = await QRCode.toBuffer(qrData);
    const tempDir = path.join(process.cwd(), "public", "temp");
    await fs.mkdir(tempDir, { recursive: true });
    tempPath = path.join(tempDir, `qr_${Date.now()}.png`);

    console.log("Temp path:", tempPath);

    await fs.writeFile(tempPath, qrBuffer);
    console.log("QR file created in public/temp");

    const uploadResult = await uploadOnCloudinary(tempPath);
    console.log("Upload success:", uploadResult?.url);

    return uploadResult?.url;
  } catch (error) {
    console.error("QR Error:", error);
    throw new ApiError(500, "Failed to upload QR code");
  } finally {
    if (tempPath) {
      const cleanupAttempts = [0, 100, 500];

      for (const delay of cleanupAttempts) {
        await new Promise((r) => setTimeout(r, delay));

        try {
          if (
            await fs
              .access(tempPath)
              .then(() => true)
              .catch(() => false)
          ) {
            await fs.unlink(tempPath);
            console.log("Temp file cleaned up");
            return;
          }
        } catch (unlinkError) {
          console.log(`Cleanup attempt ${delay}ms failed, retrying...`);
        }
      }

      console.warn("Temp file left behind:", tempPath);
    }
  }
};

export { generateQRCode, generateQRCodeImage, generateAndUploadQRCode };
