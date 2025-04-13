import UserModel from "../models/userModels.js";
import bcrypt from 'bcrypt'

// After DB connection
export const runAdminSetup = async () => {
    console.log("🛠 Checking admin setup...");
    try {
        const adminExists = await UserModel.findOne({ role: "admin" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("123456", 10);
            const admin = new UserModel({
                name: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin"
            });
            await admin.save();
            console.log("✅ Admin user created");
        } else {
            console.log("🟢 Admin user already exists");
        }
    } catch (error) {
        console.log(error);

        console.error("❌ Admin setup failed:", error.message);
    }
};


