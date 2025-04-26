import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/user"
import connectDB from "@/lib/db"




export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    await connectDB()
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return NextResponse.json({
      message: "User registered successfully",
      userId: newUser._id.toString(),
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
