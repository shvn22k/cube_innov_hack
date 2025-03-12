import jwt from 'jsonwebtoken'
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
        return null;
    }
};
export const generateAccessToken = (auth:any) => {
    return jwt.sign({userId:auth.userId,email:auth.email,username:auth.username }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1d' });
};

// Function to generate Refresh Token
export const generateRefreshToken = (auth: any) => {
    return jwt.sign({ userId:auth.userId,email:auth.email,username:auth.username},process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30d' });
};