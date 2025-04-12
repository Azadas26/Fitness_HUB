import mongoose from 'mongoose'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    bmi: { type: Number, default: null },
    wrkpage: { type: Number, default: 1 },
    role: { type: String, required: true, default: "user" }
})

UserSchema.methods.Getjwt = async function () {
    const user = this;
    const token = await jsonwebtoken.sign({ _id: user._id, role: "user" }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    return token
}

UserSchema.methods.VerifyPassword = async function (passwordFromUser) {
    const user = this;
    const password = user.password;

    const passwordCalid = await bcrypt.compare(passwordFromUser, password)

    return passwordCalid;
}


var UserModel;
try {
    UserModel = mongoose.model('user');
} catch (error) {
    UserModel = mongoose.model('user', UserSchema);
}

export default UserModel;