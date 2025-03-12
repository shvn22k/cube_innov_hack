import {NextFunction, Request,Response} from "express";
import {APIError} from "@utils/Error";
import jwt, {JwtPayload} from "jsonwebtoken"
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from Authorization header (Bearer token)
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return   next(new APIError('No Token Provided',400))
        }

        // Verify the token
        const decoded = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
        if (!decoded) {
            return next(new APIError('Invalid token',400))
        }

        // Attach user info to request object for further use in next middleware
        //@ts-ignore
        req.auth = {
            userId:decoded.userId,
            username:decoded.username,
            email:decoded.email,
        };

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};