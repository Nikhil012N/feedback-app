import mongoose from "mongoose"

const FeedbackSchema = new mongoose.Schema({
  title: String,
  content: String,
  rating: Number,
  imageUrl: String,
  response: String,
  userId: mongoose.Types.ObjectId,
  userName: String,
  userEmail: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
})

 const Feedback=mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema)
 export default Feedback;