import express from 'express';
import { isuserauth } from '../middlewares/isUserAuth.js';
import { addWorkoutList,deleteWorkout,addDoctor ,listDoctors, registerDoctor} from '../controller/Admin.controller.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

router.post("/addWorkoutList/:day",isuserauth,addWorkoutList);
router.patch("/deletWorkout",isuserauth,deleteWorkout);
router.post('/add-doctor', isuserauth,upload.single('image'), addDoctor,registerDoctor);
router.get('/listDoctors', isuserauth, listDoctors);


export default router;