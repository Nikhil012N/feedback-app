import connectDB from "@/lib/db"
import Feedback from "@/models/feedback"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
function verifyToken(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}



export async function GET(request) {
  try {

    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ message: "Token is invalid or missing" }, { status: 401 })
    }
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }
    await connectDB()
    const feedbacks = await Feedback.find({})
      .select("title content rating imageUrl response userId userName userEmail createdAt updatedAt") // Fields to select
      .sort({ createdAt: -1 })
    const formattedFeedback = feedbacks.map((feedback) => ({
      _id: feedback._id.toString(),
      title: feedback.title,
      content: feedback.content,
      rating: feedback.rating,
      imageUrl: feedback.imageUrl,
      response: feedback.response,
      user: {
        _id: feedback.userId.toString(),
        name: feedback.userName,
        email: feedback.userEmail,
      },
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }))

    return NextResponse.json(formattedFeedback)
  } catch (error) {
    console.error("Error fetching all feedback:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}