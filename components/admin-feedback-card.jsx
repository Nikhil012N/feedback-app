"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

export function AdminFeedbackCard({ feedback, onRespond, onGetAISuggestion }) {
  const [response, setResponse] = useState(feedback.response || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isEditing, setIsEditing] = useState(!feedback.response);

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      await onRespond(feedback._id, response);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetAISuggestion = async () => {
    setIsLoadingSuggestion(true);
    try {
      const suggestion = await onGetAISuggestion(feedback.content);
      if (suggestion) {
        setResponse(suggestion);
      }
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6">{feedback.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                From: {feedback.user.name} ({feedback.user.email})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
            <Chip
              label={`${feedback.rating} Star${feedback.rating !== 1 ? "s" : ""}`}
              color={getRatingColor(feedback.rating)}
              variant="outlined"
              size="small"
            />
          </Box>
        }
      />
      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
          {feedback.content}
        </Typography>
        {feedback.imageUrl && (
          <Box mt={2}>
            <img
              src={feedback.imageUrl || "/placeholder.svg"}
              alt="Feedback attachment"
              style={{ maxHeight: 192, borderRadius: 8, objectFit: "contain" }}
            />
          </Box>
        )}
      </CardContent>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Admin Response:
        </Typography>
        {isEditing ? (
          <Box>
            <TextField
              multiline
              fullWidth
              minRows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleGetAISuggestion}
                disabled={isLoadingSuggestion}
              >
                {isLoadingSuggestion ? "Getting Suggestion..." : "Get AI Suggestion"}
              </Button>
              {feedback.response && (
                <Button variant="text" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {feedback.response}
            </Typography>
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Edit Response
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function getRatingColor(rating) {
  switch (rating) {
    case 1:
      return "error";
    case 2:
      return "warning";
    case 3:
      return "info";
    case 4:
      return "primary";
    case 5:
      return "success";
    default:
      return "default";
  }
}
