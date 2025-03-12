import mongoose, {mongo} from "mongoose";
// to be refactored later
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        verified:{type:Boolean,default:false},
        phone: {
            type: String,
            trim: true,
        },
        profileImage: {
            type: String, // URL to the profile image
        },
        role: {
            type: String,
            enum: ['student', 'mentor', 'admin'],
            default: 'student',
        },
        careerInterests: {
            type: [String],
            default: [],
        },
        education: [
            {
                degree: String,
                institution: String,
                yearOfCompletion: Number,
            },
        ],
        experience: [
            {
                company: String,
                position: String,
                duration: String,
                description: String,
            },
        ],}
)
const User = mongoose.model("User", userSchema);
export default User;