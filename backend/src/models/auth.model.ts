import mongoose from "mongoose";

export const authSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    password:String,
    email:String,
    username:String,
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    refreshToken: {
        type: String,
    },
})

const Auth = mongoose.model("Auth", authSchema);
export default Auth;