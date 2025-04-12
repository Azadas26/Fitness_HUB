import mongoose from 'mongoose'

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, default: '', required: true },
    image: { type: String, required: true } // store image file path or URL
})

const DoctorModel = mongoose.model('Doctor', DoctorSchema);
export default DoctorModel;
