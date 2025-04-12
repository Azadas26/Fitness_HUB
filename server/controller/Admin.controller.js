import DoctorModel from "../models/Doctor.model.js";
import UserModel from "../models/userModels.js";
import WorkoutList from "../models/WorkoutModel.js";
import bcrypt from 'bcrypt'

export const addWorkoutList = async (req, res) => {
  try {
    const {
      workoutName,
      instruction1,
      instruction2,
      instruction3,
      repetitions,
      description,
    } = req.body;
    const { day } = req.params;

    // Find existing WorkoutList for 'admin' or create a new one
    let workoutDetails = await WorkoutList.findOne({ author: "admin" });

    if (!workoutDetails) {
      workoutDetails = new WorkoutList({ author: "admin", wkdays: [] });
    }

    // Check if day already exists in wkdays
    const existingDay = workoutDetails.wkdays.find((d) => d.day === day);

    const workoutData = {
      name: workoutName,
      inst: [instruction1, instruction2, instruction3].filter(Boolean),
      rep: repetitions,
      description,
    };

    if (existingDay) {
      // Push into existing day
      existingDay.workouts.push(workoutData);
    } else {
      // Create new day with first workout
      workoutDetails.wkdays.push({
        day,
        workouts: [workoutData],
      });
    }

    await workoutDetails.save();

    res.status(200).json({
      message: "Workout added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const { day, Id } = req.body;

    console.log("Deleting workout with ID:", Id, "on day:", day);

    const Workouts = await WorkoutList.findOne({});
    if (!Workouts) {
      return res.status(404).json({ message: "Workout list not found" });
    }

    const dayIndex = Workouts.wkdays.findIndex(item => item.day.trim().toLowerCase() === day.toString().trim().toLowerCase());

    if (dayIndex === -1) {
      return res.status(404).json({ message: "Day not found" });
    }

    const workoutsArray = Workouts.wkdays[dayIndex].workouts;

    const workoutIndex = workoutsArray.findIndex(workout => workout._id.toString() === Id.toString());

    if (workoutIndex === -1) {
      return res.status(404).json({ message: "Workout not found in the specified day" });
    }

    // Remove the workout in-place
    workoutsArray.splice(workoutIndex, 1);

    await Workouts.save();

    return res.status(200).json({ message: "Workout deleted successfully" });

  } catch (error) {
    console.error("Error deleting workout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addDoctor = async (req, res, next) => {
  try {
    const { name, email, password, bio } = req.body;
    const image = req.file?.filename;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: `This ${email} Already registered` })
    }
   
    const newDoctor = new DoctorModel({
      name,
      email,
      bio,
      image: `uploads/doctors/${image}`  // storing relative path
    });

    await newDoctor.save();
    next()

  } catch (error) {
    console.error("Error adding doctor:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const listDoctors = async (req, res) => {
  try {

    const doctorList = await DoctorModel.find({});
    return res.status(200).json(doctorList)

  } catch (error) {
    console.error("Error adding doctor:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const registerDoctor = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: `This ${email} Already registered` })
    }

    const hash_password = await bcrypt.hash(password, 10);

    const user = await UserModel.create({ name, email, password: hash_password, role: "doctor" });

    const token = await user.Getjwt()

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({
      success: true, message: " Registration success", user: {
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

