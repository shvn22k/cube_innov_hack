import {NextFunction, Request, Response} from "express";
import User from "@models/user.model";
import {APIError} from "@utils/Error";
import bcrypt from "bcryptjs";
import Auth from "@models/auth.model";
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from "@utils/token.util";
import {JwtPayload} from "jsonwebtoken";

export const signUp = async(req:Request,res:Response,next:NextFunction)=> {
    try {
        const { username, email, password, name } = req.body;



        // Check if username is already taken
        const isUsernameTaken = await User.findOne({ username, verified: true });
        if (isUsernameTaken) {
            return next(new APIError('Username already taken',400))
        }

        // Check if a user already exists with the provided email
        const isUserAlreadyExistsByEmail = await User.findOne({ email, verified: true });

        if (isUserAlreadyExistsByEmail) {

                res.status(400).json({
                    success: false,
                    message: 'User already exists with this email',
                });

        } else {
            const hashed = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            // const auth = new
            const user = new User({
                name,
                email,
                username,
            });
            await user.save();
            const auth = new Auth({
                email,
                password:hashed,
                username,
                userId: user._id,
            })
            auth.refreshToken = generateRefreshToken(auth);
            await auth.save();
            const accessToken = generateAccessToken(auth);
            res.status(200).json({
                success: true,
                accessToken,
            })

        }




    } catch (error) {
        console.error(error);
        return next(new APIError("Some error occured",500));
    }
}
export const login = async(req:Request,res:Response,next:NextFunction)=>{
    const { usernameOrEmail, password } = req.body;

    // Input validation
    if (!usernameOrEmail || !password) {
        next(new APIError("Please provide the credentials",400));
    }

    try {
        // Check if the user exists by email or username
        const auth = await Auth.findOne({$or:[{
                email:usernameOrEmail
            },{username:usernameOrEmail}]});

        if (!auth) {
            return next(new APIError('User Not Found',404));
        }

        // Compare password with the hashed password in the database
        const isMatch =  bcrypt.compare(password,auth.password!!);

        if (!isMatch) {
            return next(new APIError("Invalid Credentials",403));
        }

        // If the password is correct, create a JWT token
        const accessToken = generateAccessToken(auth);
        const refreshToken = generateRefreshToken(auth);
        auth.refreshToken= refreshToken;
        await auth.save();
        res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true });
        // Send the token in the response
        res.status(200).json({
            success: true,
            message: 'Login successful.',
            accessToken,refreshToken
        });
    } catch (error) {
        console.error(error);
        return next(new APIError("Some error occured",500));
    }
}

export const refreshToken = async(req:Request,res:Response,next:NextFunction)=>{
    const refreshToken = req.headers.authorization?.split(' ')[1];
    // const refreshToken = req.body.token;

    if (!refreshToken) {
        res.status(403).json({ success: false, message: 'Refresh token required' });
        return;
    }

    // Verify the refresh token
    const userData = verifyRefreshToken(refreshToken) as JwtPayload;

    if (!userData) {
        return next(new APIError('Invalid or expired refresh token',401));
    }
    const auth = await Auth.findOne({refreshToken:refreshToken});
    if(!auth){
        return next(new APIError('Invalid or expired refresh token',403));
    }
    // Generate new access token
    const accessToken = generateAccessToken(auth);

    res.status(200).json({
        success: true,
        accessToken,  // Send new access token
    });
}
export const logout = async(req:Request,res:Response,next:NextFunction)=>{
    //@ts-ignore
    const _auth = req.auth;

    try {
        const auth = await Auth.findById(_auth.userId);
        if(!auth){
            return next(new APIError("Invalid session please login again",401))
        }
        auth.refreshToken = null;
        await auth.save();
        res.status(200).json({success:true,message:"Logout successfull"});
    } catch (error) {
        console.error(error);
        return next(new APIError("Some error occured",500));
    }
}