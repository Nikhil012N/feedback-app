"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { AdminFeedbackCard } from "@/components/admin-feedback-card"
import { DashboardHeader } from "@/components/dashboard-header"

export const dynamic = "force-dynamic"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  useEffect(() => {
    const loadUserAndFeedback = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return router.push("/login")

        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!userRes.ok) throw new Error("Authentication failed")

        const userData = await userRes.json()

        if (userData.role !== "admin") {
          toast.error("Unauthorized access")
          return router.push("/login")
        }

        setUser(userData)

        const feedbackRes = await fetch("/api/feedback/all", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!feedbackRes.ok) throw new Error("Failed to load feedback")

        const feedbackData = await feedbackRes.json()
        setFeedbacks(feedbackData)
        setFilteredFeedbacks(feedbackData)
      } catch (err) {
        toast.error(err.message || "Failed to load data.")
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndFeedback()
  }, [router])

  useEffect(() => {
    let result = [...feedbacks]

    if (searchTerm) {
      result = result.filter((fb) =>
        [fb.title, fb.content, fb.user?.name || ""]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    }

    if (ratingFilter !== "all") {
      result = result.filter((fb) => fb.rating?.toString() === ratingFilter)
    }

    result.sort((a, b) => {
      const dA = new Date(a.createdAt).getTime()
      const dB = new Date(b.createdAt).getTime()
      return sortOrder === "newest" ? dB - dA : dA - dB
    })

    setFilteredFeedbacks(result)
  }, [feedbacks, searchTerm, ratingFilter, sortOrder])

  const handleRespond = async (feedbackId, response) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      const res = await fetch(`/api/feedback/${feedbackId}/respond`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to respond")
      }

      toast.success("Response submitted")

      const updated = await fetch("/api/feedback/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFeedbacks(await updated.json())
    } catch (err) {
      toast.error(err.message || "Failed to submit response")
    }
  }

  const handleGetAISuggestion = async (content) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      const res = await fetch("/api/ai/suggestion", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedbackContent: content }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to get suggestion")
      }

      const data = await res.json()
      return data.suggestion
    } catch (err) {
      toast.error(err.message || "AI suggestion failed")
      return ""
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} isAdmin />

      <main className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel>Filter by Rating</InputLabel>
                <Select
                  value={ratingFilter}
                  label="Filter by Rating"
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <MenuItem value="all">All Ratings</MenuItem>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <MenuItem key={r} value={r.toString()}>
                      {r} Star{r !== 1 ? "s" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Sort by Date</InputLabel>
                <Select
                  value={sortOrder}
                  label="Sort by Date"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Feedback Entries ({filteredFeedbacks.length})
          </h2>

          {filteredFeedbacks.length === 0 ? (
            <Card>
              <CardContent className="text-center text-gray-500">
                No feedback entries found.
              </CardContent>
            </Card>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <AdminFeedbackCard
                key={feedback._id}
                feedback={feedback}
                onRespond={handleRespond}
                onGetAISuggestion={handleGetAISuggestion}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}