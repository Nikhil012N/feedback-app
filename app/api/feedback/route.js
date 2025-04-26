import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import Feedback from "@/models/feedback"
import User from "@/models/user"
import connectDB from "@/lib/db"
import multer from "multer"
import path from "path"
import fs from "fs"

// Helper function to verify JWT token
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

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./public/uploads"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)  // set the destination for uploaded files
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = Date.now() + ext
    cb(null, filename)  // Set the filename
  },
})

// Initialize multer
const upload = multer({ storage })

// POST handler for creating feedback with image upload
export async function POST(request) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB() // Ensure Mongoose connection

    // Get user from database
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const title = formData.get("title")
    const content = formData.get("content")
    const rating = Number.parseInt(formData.get("rating"))
    const image = formData.get("image")

    // Validate input
    if (!title || !content || isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 })
    }

    // Handle image upload
    const uploadMiddleware = (req, res, next) => {
      upload.single("image")(req, res, (err) => {
        if (err) {
          return next(err)
        }
        next()
      })
    }

    // Define a custom handler to run the multer middleware
    await new Promise((resolve, reject) => {
      const req = { formData }
      const res = {
        send: () => resolve(),
        status: () => res,
        json: () => reject(new Error("Multer upload failed")),
      }

      uploadMiddleware(req, res, (err) => {
        if (err) reject(err)
        resolve()
      })
    })

    // Get the uploaded file path
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

    // Create new feedback
    const newFeedback = new Feedback({
      title,
      content,
      rating,
      imageUrl,
      response: null,
      userId: decoded.userId,
      userName: user.name,
      userEmail: user.email,
    })

    const result = await newFeedback.save()

    // Format for client
    const formattedFeedback = {
      _id: result._id.toString(),
      title: result.title,
      content: result.content,
      rating: result.rating,
      imageUrl: result.imageUrl,
      response: result.response,
      user: {
        _id: result.userId.toString(),
        name: result.userName,
        email: result.userEmail,
      },
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }

    return NextResponse.json(formattedFeedback)
  } catch (error) {
    console.error("Error creating feedback:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
 