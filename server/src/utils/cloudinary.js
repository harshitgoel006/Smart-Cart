import{v2 as cloudinary} from 'cloudinary';
import fs from 'fs';



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath) => {
    try{
        if(!localFilePath){
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
            folder: "SmartCart/avatars"
        })
        
        fs.unlinkSync(localFilePath);
        
        return {
            url: response.secure_url,
            public_id: response.public_id
        };
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        return null;
    }
}


export { uploadOnCloudinary };