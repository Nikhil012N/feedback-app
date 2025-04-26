import { NextResponse } from "next/server";
import Feedback from "@/models/feedback";
import User from "@/models/user";
import connectDB from "@/lib/db";
import path from "path";
import fs from "fs/promises";
import { verifyToken } from "@/lib/auth-service";

async function saveFile(file) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");


  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("Error creating upload folder:", error);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(uploadDir, filename);

  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${filename}`; 
}


export async function GET(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const feedbacks = await Feedback.find({ userId: decoded.userId }).sort({ createdAt: -1 });

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
    }));

    return NextResponse.json(formattedFeedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST API
export async function POST(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const rating = Number(formData.get("rating"));
    const image = formData.get("image");

    // Validation
    if (!title || !content || isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    let imageUrl = null;
    if (image && image.size > 0) {
      imageUrl = await saveFile(image);
    }

    const newFeedback = new Feedback({
      title,
      content,
      rating,
      imageUrl,
      response: null,
      userId: decoded.userId,
      userName: user.name,
      userEmail: user.email,
    });

    const result = await newFeedback.save();

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
    };

    return NextResponse.json(formattedFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
