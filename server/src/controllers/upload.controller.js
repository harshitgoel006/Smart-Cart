import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadFile = async (req, res)=> {
    try{
        const localFilePath = req.file?.path;
        if(!localFilePath){
            return res
            .status(400)
            .json({
                message: "No file uploaded"
            })
        }

        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

        return res
        .status(200)
        .json({
            message: "File uploaded successfully",
            url: cloudinaryResponse.url,
        });
    }
    catch(error){
        return res
        .status(500)
        .json({
            message: "File upload failed",
            error: error.message,
        })
    }
}


export { uploadFile };
