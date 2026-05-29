import dotenv from "dotenv";
import app from "./app";
import connectDB from "@db/connect";
dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_CONNECTION_STR = process.env.MONGO_URI;


const start = async () => { 
  try {
    await connectDB(DB_CONNECTION_STR!);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
  
}
start();