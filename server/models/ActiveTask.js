import mongoose, { Schema } from 'mongoose';

const ActiveTaskSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        active: {
            type: [
                {
                    day: {
                        type: String,
                        required: true,
                    },
                    workoutsId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Workout_List", 
                        required: true,
                    },
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const ActiveTask = mongoose.model('Active_Task', ActiveTaskSchema);

export default ActiveTask;
