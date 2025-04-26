import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/db"
import User from "@/models/user"


export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(decoded.userId).select("-password") // exclude password

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
