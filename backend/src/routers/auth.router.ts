import { login, logout,  refreshToken,  signUp,  } from "@controllers/auth.controller";
import { authenticate } from "@middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.post('/sign-up',signUp);
router.post('/login',login);

router.post('/refresh-token',refreshToken)
router.post('/logout',authenticate,logout)


export default router