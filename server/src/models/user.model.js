import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema
(
    {
        username: {
            type: String,
            required: [true,"username is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String, 
            required: [true,"full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true,"email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "password must be atleast 6 characters"],
            select: false,

        },
        avatar: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
            
            minlength: [10, "phone number must be 10 digits"],
            maxlength: [10, "phone number must be 10 digits"],
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'seller'],
            default: 'user'
        },
        
        address: [
  {
    label: {
      type: String,  
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    }
  }
],
},
    {timestamps: true}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function
(password){
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d'
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '1d'
        }
    )
}


export const User = mongoose.model("User", userSchema);