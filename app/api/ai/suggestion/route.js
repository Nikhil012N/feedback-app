import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { verifyToken } from "@/lib/auth-service"


export async function POST(request) {
  try {
    const decoded = verifyToken(request)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { feedbackContent } = await request.json()

    if (!feedbackContent) {
      return NextResponse.json({ message: "Feedback content is required" }, { status: 400 })
    }

    // Generate AI response suggestion using Groq
    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: `Generate a professional and empathetic response to the following customer feedback: "${feedbackContent}"`,
      system:
        "You are a customer service representative. Your goal is to provide helpful, empathetic, and professional responses to customer feedback. Keep responses concise (2-3 sentences).",
    })

    return NextResponse.json({ suggestion: text })
  } catch (error) {
    console.error("Error generating AI suggestion:", error)
    return NextResponse.json({ message: "Failed to generate suggestion" }, { status: 500 })
  }
}
