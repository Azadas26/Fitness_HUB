import mongoose, { Schema } from 'mongoose';

const WorkoutSchema = new Schema(
    {
        author: {
            type: String,
            default: 'admin',
        },
        wkdays: {
            type: [
                {
                    day: {
                        type: String,
                        required: true,
                    },
                    workouts: {
                        type: [
                            {
                                name: { type: String, default: "", required: true },
                                inst: [{ type: String }],
                                rep: { type: String, required: true },
                                description: { type: String, required: true },
                            },
                        ],
                        default: [],
                    },
                },
            ],
            default: [], 
        },
    },
    { timestamps: true }
);

const WorkoutList = mongoose.model('Workout_List', WorkoutSchema);

export default WorkoutList;
