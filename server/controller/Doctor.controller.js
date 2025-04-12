import ChatModel from "../models/Chat.model.js";

export const getClients = async (req, res) => {
    try {
        const { userId } = req.body;
        const chat_messages = await ChatModel.find({ doctorId: userId })
            .populate("userId", "-email -password -verifyOtp -verifyOtpExpireAt -isAccountVerified  -resetOtp -resetOtpExpireAt")
        if (chat_messages.length === 0) {
            return res.status(404).json({ success: false, message: "No clients found" })
        }

        const getClients = chat_messages.map(item => item.userId)

        return res.status(200).json({ success: true, getClients })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getClientMessage = async (req, res) => {
    try {
        const { userId } = req.body;
        const { clId } = req.params;

        const chat_messages = await ChatModel.findOne({ doctorId: userId, userId: clId })

        if (chat_messages.length === 0) {
            return res.status(404).json({ success: false, message: "No clients found" })
        }

        return res.status(200).json({ success: true, chat_messages })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const SendMessage = async (req, res) => {
    try {
        const { userId, message } = req.body;
        const { clId } = req.params;

        const chat_messages = await ChatModel.findOne({ doctorId: userId, userId: clId })

        if (chat_messages.length === 0) {
            return res.status(404).json({ success: false, message: "No clients found" })
        }

        chat_messages.messages.push({
            message: message,
            isdoctor: true
        })

        await chat_messages.save()

        return res.status(200).json({ success: true ,message})

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
