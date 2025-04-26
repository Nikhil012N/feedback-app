"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  CssBaseline,
  Container,
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
  Rating,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { DashboardHeader } from "@/components/dashboard-header";
import Axios from "@/lib/axios-interceptor";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Feedback must be at least 10 characters" }),
  rating: z.number().min(1, { message: "Please select a rating" }),
  image: z
    .any()
    .optional()
    .refine(
      (files) => !files || (files instanceof FileList && files.length <= 1),
      "Only one file is allowed"
    )
    .refine(
      (files) => !files || (files instanceof FileList && files[0]?.size <= 5000000),
      "Maximum file size is 5MB"
    )
    .refine(
      (files) => !files || (files instanceof FileList && 
        ['image/jpeg', 'image/png', 'image/gif'].includes(files[0]?.type)),
      "Only .jpg, .png, and .gif formats are supported"
    ),
});

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", content: "", rating: 0 },
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [userResponse, feedbackResponse] = await Promise.all([
          Axios.get("/auth/me"),
          Axios.get("/feedback"),
        ]);
  
        setUser(userResponse.data);
        setFeedbacks(feedbackResponse.data);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || "Failed to load data");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();
  }, [router]);
  
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("rating", values.rating.toString());
      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }
      await Axios.post("/feedback", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success("Feedback submitted successfully!");
      form.reset();
      const { data } = await Axios.get("/feedback");
      setFeedbacks(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <DashboardHeader user={user} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Feedback Form */}
          <Grid item xs={12} md={5} lg={4}>
            <Card elevation={3}>
              <CardHeader
                title="Submit Feedback"
                subheader="Help us improve our service"
              />
              <Divider />
              <CardContent>
                <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
                  <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    {...form.register("title")}
                    error={!!form.formState.errors.title}
                    helperText={form.formState.errors.title?.message}
                  />

                  <TextField
                    label="Your Feedback"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    {...form.register("content")}
                    error={!!form.formState.errors.content}
                    helperText={form.formState.errors.content?.message}
                  />

                  <Box mt={2} mb={2}>
                    <Typography variant="body1" gutterBottom>
                      Rating
                    </Typography>
                    <Rating
                      value={Number(form.watch("rating"))}
                      onChange={(e, newValue) => {
                        form.setValue("rating", newValue || 0);
                      }}
                      precision={1}
                      size="large"
                    />
                    {form.formState.errors.rating && (
                      <Typography color="error" variant="caption">
                        {form.formState.errors.rating?.message}
                      </Typography>
                    )}
                  </Box>

                  <Box mb={3}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="feedback-image"
                      type="file"
                      onChange={(e) => form.setValue("image", e.target.files)}
                    />
                    <label htmlFor="feedback-image">
                      <Button variant="outlined" component="span" fullWidth>
                        {form.watch("image")?.[0]?.name || "Upload Image"}
                      </Button>
                    </label>
                    {form.formState.errors.image && (
                      <Typography color="error" variant="caption">
                        {form.formState.errors.image?.message}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    size="large"
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Feedback History */}
          <Grid item xs={12} md={7} lg={8}>
            <Typography variant="h6" gutterBottom>
              Your Feedback History
            </Typography>

            {feedbacks.length === 0 ? (
              <Card>
                <CardContent>
                  <Typography color="text.secondary">
                    You haven't submitted any feedback yet.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {feedbacks.map((feedback) => (
                  <Card key={feedback._id} variant="outlined">
                    <CardHeader
                      title={feedback.title}
                      subheader={`Submitted ${formatDistanceToNow(
                        new Date(feedback.createdAt),
                        { addSuffix: true }
                      )}`}
                      action={
                        <Rating
                          value={feedback.rating}
                          readOnly
                          precision={0.5}
                          size="small"
                        />
                      }
                    />
                    <CardContent>
                      <Typography paragraph>
                        {feedback.content}
                      </Typography>
                      {feedback.imageUrl && (
                        <Box
                          component="img"
                          src={feedback.imageUrl}
                          alt="Feedback attachment"
                          sx={{
                            maxHeight: 200,
                            maxWidth: "100%",
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </CardContent>
                    {feedback.response && (
                      <>
                        <Divider />
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Admin Response
                          </Typography>
                          <Typography paragraph>
                            {feedback.response}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(feedback.updatedAt), {
                              addSuffix: true,
                            })}
                          </Typography>
                        </CardContent>
                      </>
                    )}
                  </Card>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}