import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Feedback from "@/models/feedback"
import { verifyToken } from "@/lib/auth-service"



export async function POST(request, { params }) {
  try {
    const decoded = verifyToken(request)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { response } = await request.json()
    if (!response) {
      return NextResponse.json({ message: "Response is required" }, { status: 400 })
    }

    await dbConnect()

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { response, updatedAt: new Date() },
      { new: true }
    )

    if (!feedback) {
      return NextResponse.json({ message: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json({
      _id: feedback._id.toString(),
      title: feedback.title,
      content: feedback.content,
      rating: feedback.rating,
      imageUrl: feedback.imageUrl,
      response: feedback.response,
      user: {
        _id: feedback.userId,
        name: feedback.userName,
        email: feedback.userEmail,
      },
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    })
  } catch (error) {
    console.error("Error responding to feedback:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
