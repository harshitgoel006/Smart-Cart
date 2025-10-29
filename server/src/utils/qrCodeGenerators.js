import QRCode from "qrcode";
import crypto from "crypto";

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


const generateAndUploadQRCode = async (orderId) => {
  try {
    const qrCodeBuffer = await QRCode.toBuffer(orderId, {
      width: 400,
      margin: 2
    });
    
    
    const cloudinaryResponse = await uploadOnCloudinary(qrCodeBuffer, {
      folder: "order-qrcodes",
      resource_type: "image"
    });
    
    return cloudinaryResponse.secure_url;
  } catch (error) {
    throw new Error("Failed to upload QR code");
  }
};

export {
    generateQRCode,
    generateQRCodeImage,
    generateAndUploadQRCode
};