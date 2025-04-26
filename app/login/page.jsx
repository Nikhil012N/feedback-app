"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  Feedback,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { login } from "@/lib/auth-service";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { user } = await login(values);
      toast.success("Logged in successfully!");
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid email or password";
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
          py: 4,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
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
                fontWeight="700"
                color="primary"
              >
                FeedbackPortal
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          minHeight: "calc(100dvh - 100px) ",
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
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h4" component="h1" fontWeight={600}>
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                Sign in to access your feedback dashboard
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ width: "100%", mt: 2 }}
              >
                <Stack spacing={3}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    variant="outlined"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                      "Sign In"
                    )}
                  </Button>
                </Stack>
              </Box>

              <Divider flexItem>or</Divider>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?
                </Typography>
                <Link href="/signup" passHref>
                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight={500}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign up
                  </Typography>
                </Link>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
