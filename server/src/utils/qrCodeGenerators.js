import QRCode from "qrcode";
import crypto from "crypto";
import { ApiError } from "./ApiError.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateQRCode = async () => {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const qrData = `ORDER-${uniqueId}-${timestamp}`;

  return qrData;
};

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

const generateAndUploadQRCode = async (qrData) => {
  let tempPath;

  try {
    const qrBuffer = await QRCode.toBuffer(qrData);
    const tempDir = path.join(process.cwd(), "public", "temp");
    await fs.mkdir(tempDir, { recursive: true });
    tempPath = path.join(tempDir, `qr_${Date.now()}.png`);


    await fs.writeFile(tempPath, qrBuffer);

    const uploadResult = await uploadOnCloudinary(tempPath);

    return uploadResult?.url;
  } catch (error) {
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
            return;
          }
        } catch (unlinkError) {
        }
      }

      console.warn("Temp file left behind:", tempPath);
    }
  }
};

export { generateQRCode, generateQRCodeImage, generateAndUploadQRCode };
