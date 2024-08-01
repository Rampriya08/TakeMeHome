import express from 'express';
import { loginUser, logoutUser, signUpUser } from '../controller/auth.controller.js';


const router=express.Router();

router.post("/signup",signUpUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser);



export default router
