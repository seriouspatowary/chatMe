import mongoose from 'mongoose'

export const connectDB = async () => {
    
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB is Connected Successfully");
        
    } catch (error) {
         console.log("mongodb error",error)
    }
}