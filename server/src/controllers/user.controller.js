import {asyncHandler} from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import {OTP} from "../models/otp.model.js";


const generateAccessAndRefreshToken = async (userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generate access and refresh token");
    }
}


const sendOtp = asyncHandler(async (req, res) => {
    const {email, role} = req.body;
    
    if(!(email && role)){
        throw new ApiError(400, "Email and role are required");
    }

    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new ApiError(400, "User with this email is already exist");
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({email}); // Clear any existing OTP for the email
    await OTP.create({email, otp});

    const subject = "Your OTP from SmartCart for Signup";
    const html = `<p> Your OTP is <b>${otp}</b>. It is valid for 10 minute. </p>`;

    await sendEmail(email, subject, html);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            null, 
            "OTP sent successfully to your email"
        ));

});

const registerUser = asyncHandler(async (req, res)=>{ const { email, username, fullname, password, role, phone } = req.body;

  if (!email || !fullname || !username || !password || !role || !phone) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }]
  });
  if (userExists) {
    throw new ApiError(400, "User with this email  already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    email,
    username,
    fullname,
    password,
    role,
    phone,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
console.log("Verifying OTP");
const { email, otp } = req.body;
console.log(email, otp);

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }
  console.log("Verifying OTP for email:", email, otp);
  const existingOtp = await OTP.findOne({ email });
  console.log(existingOtp);
  if (!existingOtp || existingOtp.otp !== otp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }


  await OTP.deleteOne({ email });

  return res.status(200).json(
    new ApiResponse(200, null, "OTP verified successfully")
  );
});


const loginUser = asyncHandler(async(req, res)=>{
console.log("Logging in user");
  const { email, password} = req.body;
  console.log("Logging in user with email:", email, password);

  if(!email){
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({email}).select("+password +refreshToken");

  if(!user){
    throw new ApiError(400, "User with this email does not exist");
  }
  
  const isPasswordValid = await user.isPasswordCorrect(password)
  
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
}

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


  const options = {
    httpOnly: true,
    secure: true,
}

return res
.status(200)
.cookie("accessToken",accessToken, options)
.cookie("refreshToken",refreshToken, options)
.json(
    new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged in Successfully"
    )
)

})

const logOutUser = asyncHandler(async (req, res) => {
  
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponses(
        200,
        {},
        "user logged out successfully"
      )
    )
})

export {
    sendOtp,
    registerUser,
    verifyOtp,
    loginUser,
    logOutUser
}

