import { getEnvVariable } from '../utils/helpers/getEnvVariable';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const mongoURI = getEnvVariable('MONGO_URI');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB Connection Failed!: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
