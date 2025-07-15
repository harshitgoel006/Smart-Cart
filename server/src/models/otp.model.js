import mongoose from "mongoose";


const otpSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            lowercase: true,
            
            trim: true
        },
        otp: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            default: () => Date.now()+ 10*60*1000,
        },
    },
    {
        timestamps: true,
    }
)

otpSchema.index({expiresAt: 1}, {expiresAfterSeconds: 0});

export const OTP = mongoose.model("OTP", otpSchema);