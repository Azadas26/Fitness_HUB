import express from 'express';
import { isuserauth } from '../middlewares/isUserAuth.js';
import { addWorkoutList } from '../controller/Admin.controller.js';


const router = express.Router();

router.post("/addWorkoutList/:day",isuserauth,addWorkoutList);


export default router;