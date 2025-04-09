import mongoose from 'mongoose'

export const connectDB = async ()=>{
    mongoose.connection.on('connected',()=>console.log("Database connection successfull"));
    mongoose.connection.on('error',(err)=>console.error("Database connection Error"));
    mongoose.connection.on('disconnected',()=>{
        console.log("Databse Connection disconnected");
        console.log("Attemting to reconnect....");
        setTimeout(()=>connectDB(),5000); 
    })
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/Fit_hub`)
    } catch (error) {
            console.log("Error During intial connection",error);
            process.exit(1);
    }
}

