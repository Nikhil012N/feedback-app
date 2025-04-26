import bcrypt from "bcryptjs";
import connectDB from "./db.js";
import User from "../models/user.js";

const seedDB = async () => {
  try {
    await connectDB();


    const adminEmail = "admin@yopmail.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("password@123", 10);
      await User.create({
        name: "Admin Temp",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin seeded successfully!");
    } else {
      console.log("ℹ Admin already exists!");
    }

 
    const userEmail = "user@yopmail.com";
    const userExists = await User.findOne({ email: userEmail });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash("password@123", 10);
      await User.create({
        name: "User Temp",
        email: userEmail,
        password: hashedPassword,
        role: "user",
      });
      console.log(" User seeded successfully!");
    } else {
      console.log("ℹ User already exists!");
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    process.exit();
  }
};

seedDB();
