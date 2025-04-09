import express from 'express';
import { LoginValidation, registerValidation } from '../middlewares/authValidation.js';
import { getUserDetails, isUserauthenticatedornot, login, logout, register, resetPassword,
     sendRestOtp, sendVerificationOtp, verifyEmail,updateBMIratio,updateWorkPage,getUserWorkoutList } from '../middlewares/authControllers.js';
import { isuserauth } from '../middlewares/isUserAuth.js';
import UserModel from '../models/userModels.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', LoginValidation, login);
router.get('/logout', logout);
router.post('/send-otp', isuserauth, sendVerificationOtp);
router.post('/verify-email', isuserauth, verifyEmail);
router.post('/reset-password', resetPassword);


router.get('/is-auth', isuserauth, isUserauthenticatedornot);
router.post('/send-reset-otp', sendRestOtp);
router.get('/user-details', isuserauth, getUserDetails)
router.get('/getProfile',isuserauth,async(req,res)=>{
    const userDetails = await UserModel.findOne({_id:req.body.userId});
    res.json(userDetails)
})
router.patch('/updateBMIratio',isuserauth,updateBMIratio)

router.patch("/updateWorkPage/:page",isuserauth,updateWorkPage)
router.get("/getUserWorkoutList/:page",isuserauth,getUserWorkoutList)


export default router;