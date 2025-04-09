import bcrypt from 'bcrypt'
import UserModel from '../models/userModels.js'
import jsonwebtoken from 'jsonwebtoken'
import transporter from '../config/modeMailer.js';
import { EMAIL_VERIFY_TEMPLATE } from '../config/emailTemplate.js';
import WorkoutList from '../models/WorkoutModel.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: `This ${email} Already registered` })
        }

        const hash_password = await bcrypt.hash(password, 10);

        const user = await UserModel.create({ name, email, password: hash_password });

        const token = await user.Getjwt()

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            success: true, message: "User Registration success", user: {
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }

        console.log("useruseruser", user);

        const pawdismatch = user.VerifyPassword(password)

        if (!pawdismatch) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }
        const token = jsonwebtoken.sign({ "_id": user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true, message: "Login success", user: {
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
        });
        return res.status(200).json({ success: true, message: "Loged Out" });
    } catch (error) {
        return res.json(500).json({ success: false, message: error.message })
    }
}

export const sendVerificationOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);
        // console.log(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account Already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        console.log("OTP", otp);


        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Hello Welcomt to MERN Authentiction", // Subject line
            // text: "MERN Email Authentication confirm", // plain text body
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp)
        };


        try {
            await transporter.sendMail(mailOption);
        } catch (error) {
            console.log(error);

        }
        return res.status(200).json({ success: true, message: `Otp Send to this mail address :${user.email}` })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            return res.status(400).json({ success: false, message: "Missing Detailes" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Existing" });
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid Otp" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Otp Expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Hello Welcomt to MERN Authentiction", // Subject line
            text: "MERN Email Authentication confirm", // plain text body
            html: ` <div>
                     <h1>SuccessFully complee Email</h1>
                     <h3>Email verification success </h3>
                     </div>`, // html body
        };

        try {
            await transporter.sendMail(mailOption);
        } catch (error) {
            return res.status(500).json({ sucess: false, message: error.message })
        }

        return res.status(200).json({ success: true, message: "Email Verification success" });

    } catch (error) {

    }

}

export const isUserauthenticatedornot = (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "It's an Autherized User" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const sendRestOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email Required" })
    }

    try {

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        return res.status(200).json({ success: true, message: "Otp send To your Mail address" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newpassword } = req.body;
    console.log(req.body);

    if (!email || !otp || !newpassword) {
        return res.status(400).json({ success: false, message: "Invalid Input" });
    }

    try {

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }

        if (user.resetOtp == "" || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid Otp" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: " Otp Expired" });
        }

        const hashpassword = await bcrypt.hash(newpassword, 10);

        user.password = hashpassword;
        user.resetOtp = ''
        user.resetOtpExpireAt = 0;
        user.save();

        return res.status(200).json({ success: true, message: "Password successfully updated" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "UserNot found Please Login" })
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "UserNot Available" })
        }
        console.log(user.isAccountVerified);

        return res.status(200).json({
            success: true, user: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
                height: user.height,
                weight: user.weight,
                bmi: user.bmi,
                role: "user",
                wrkpage: user.wrkpage,
            }, message: "User Found sucessfully"
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.mesage })
    }
}

export const updateBMIratio = async (req, res) => {
    try {
        const { userId, height, weight } = req.body;

        const UserDetails = await UserModel.findById(userId);
        if (!UserDetails) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        // Calculate BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // Update fields
        UserDetails.height = height;
        UserDetails.weight = weight;
        UserDetails.bmi = bmi.toFixed(2);

        await UserDetails.save();

        return res.status(200).json({
            success: true,
            message: "BMI updated successfully",
            data: {
                height: UserDetails.height,
                weight: UserDetails.weight,
                bmi: UserDetails.bmi,
            },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateWorkPage = async (req, res) => {
    try {
        const { page } = req.params;
        const { userId } = req.body;

        const userDetails = await UserModel.findOne({ _id: userId });
        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const pageNumber = Number(page);
        if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 30) {
            return res.status(400).json({ success: false, message: "Invalid page number. Update not possible." });
        }

        userDetails.wrkpage = pageNumber;
        await userDetails.save();

        return res.status(200).json({ success: true, message: "Workout page updated successfully." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserWorkoutList = async (req, res) => {
    try {
        const { page } = req.params;

        // Assuming there's only one document that contains all workout days
        const workoutDetails = await WorkoutList.findOne({});

        if (!workoutDetails) {
            return res.status(404).json({
                success: false,
                message: "Workout data not found",
            });
        }

        
        

        // Filter workouts for the specific day
        const userWorkouts = workoutDetails.wkdays.filter(
            (item) => item.day === page
        );

        console.log(JSON.stringify(userWorkouts,null,2));

        return res.status(200).json({
            success: true,
            workouts: userWorkouts[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

