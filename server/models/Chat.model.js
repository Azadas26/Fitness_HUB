import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        messages: {
            type: [
                {
                    message: {
                        type: String,
                        required: true,
                    },
                    isdoctor: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
