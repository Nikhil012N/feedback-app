"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Typography,
  Container,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Feedback } from "@mui/icons-material";
import { signup } from "@/lib/auth-service";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create account. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <Box
        component="header"
        sx={{
          py: 3,
          backgroundColor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            onClick={() => router.push("/")}
          >
            <Feedback color="primary" fontSize="large" />
            <Typography
              variant="h5"
              component="h1"
              fontWeight={700}
              color="primary"
            >
              FeedbackPortal
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          minHeight: "calc(100vh - 100px)",
          display: "flex",
          alignItems: "center",
          py: 4,
        }}
      >
        <Card
          sx={{
            width: "100%",
            p: { xs: 2, sm: 4 },
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardHeader
            title="Create Account"
            subheader="Join our feedback community"
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={3}>
                <TextField
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Stack direction="row" justifyContent="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <Link href="/login" passHref>
                <Typography
                  variant="body2"
                  color="primary"
                  fontWeight={500}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign in
                </Typography>
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
