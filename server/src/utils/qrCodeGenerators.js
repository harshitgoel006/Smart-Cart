import QRCode from "qrcode";
import crypto from "crypto";
import { ApiError } from "./ApiError.js";
import path from "path";
import fs from "fs/promises";                   
import fsSync from 'fs';  
import { uploadOnCloudinary } from "./cloudinary.js";  
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const generateQRCode = async () =>{

    const uniqueId = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const qrData = `ORDER-${uniqueId}-${timestamp}`;
  
    return qrData;
}

const generateQRCodeImage = async (orderId) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(orderId, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
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
    tempPath = path.join(process.cwd(), 'temp', `qr_${Date.now()}.png`);
    
    
    await fs.writeFile(tempPath, qrBuffer);
    
    const uploadResult = await uploadOnCloudinary(tempPath);
    
    return uploadResult?.url;
    
  } catch (error) {
    throw new ApiError(500, "Failed to upload QR code");
  } finally {
    if (tempPath && fsSync.existsSync(tempPath)) {
    fsSync.unlinkSync(tempPath);
  }
  }
};







export {
    generateQRCode,
    generateQRCodeImage,
    generateAndUploadQRCode
};