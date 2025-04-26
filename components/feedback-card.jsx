import { formatDistanceToNow } from "date-fns"
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material"

export function FeedbackCard({ feedback }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h6">{feedback.title}</Typography>
            <Chip
              label={`${feedback.rating} Star${feedback.rating !== 1 ? "s" : ""}`}
              color={getRatingColor(feedback.rating)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
          </Typography>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-line" }}>
          {feedback.content}
        </Typography>

        {feedback.imageUrl && (
          <Box mt={2}>
            <img
              src={feedback.imageUrl || "/placeholder.jpg"}
              alt="Feedback attachment"
              style={{
                maxHeight: "12rem",
                borderRadius: "8px",
                objectFit: "contain",
                width: "100%",
              }}
              onError={(e)=>e.target.src="/placeholder.jpg"}
            />
          </Box>
        )}
      </CardContent>

      {feedback.response && (
        <>
          <Divider />
          <CardActions sx={{ flexDirection: "column", alignItems: "flex-start", px: 2, py: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Response from Admin:
            </Typography>
            <Typography variant="body2" color="text.primary">
              {feedback.response}
            </Typography>
          </CardActions>
        </>
      )}
    </Card>
  )
}

function getRatingColor(rating) {
  switch (rating) {
    case 1:
      return "error"
    case 2:
      return "default"
    case 3:
      return "secondary"
    case 4:
      return "primary"
    case 5:
      return "success"
    default:
      return "default"
  }
}
