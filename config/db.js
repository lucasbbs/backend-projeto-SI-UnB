import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'investments',
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
};

export { connectDB, closeDB };
