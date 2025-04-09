import WorkoutList from "../models/WorkoutModel.js";

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
