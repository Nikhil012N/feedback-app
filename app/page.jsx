'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  useTheme,
  Stack,
} from '@mui/material';
import { Feedback, RateReview, CheckCircle, TrendingUp } from '@mui/icons-material';

export default function Home() {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      {/* Header */}
      <Box component="header" sx={{ 
        py: 4,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}>
        <Container maxWidth="lg">
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
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
            <Stack direction="row" spacing={2}>
              <Link href="/login" passHref>
                <Button variant="outlined" color="primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button variant="contained" color="primary">
                  Get Started
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box component="main" sx={{ flex: 1, py: 10 }}>
        <Container maxWidth="lg">
          <Stack 
            spacing={4} 
            alignItems="center" 
            textAlign="center"
            sx={{ mb: 10 }}
          >
            <Typography 
              variant="h2" 
              component="h2" 
              fontWeight="700"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2
              }}
            >
              Your Voice Matters
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              maxWidth="700px"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              Help shape better products and services by sharing your valuable feedback.
            </Typography>
            <Link href="/signup" passHref>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ 
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Join Now
              </Button>
            </Link>
          </Stack>

          {/* Features Grid */}
          <Grid container spacing={4}>
            {[
              {
                icon: <RateReview  fontSize="large" />,
                title: "Share Feedback",
                description: "Easily submit ratings and comments about your experiences."
              },
              {
                icon: <CheckCircle  fontSize="large" />,
                title: "Get Responses",
                description: "Receive acknowledgments and see how your input makes a difference."
              },
              {
                icon: <TrendingUp fontSize="large" />,
                title: "Track Improvements",
                description: "Follow the changes implemented based on community feedback."
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  variant="outlined"
                  sx={{ 
                    height: '100%',
                    p: 3,
                    borderRadius: 2,
                    borderColor: 'divider',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  <Stack spacing={2} alignItems="flex-start">
                    <Box sx={{ 
                      p: 2,
                      bgcolor: 'primary.light',
                      borderRadius: '50%',
                      color: 'primary.contrastText'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="600">
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ 
        py: 4,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="body2" 
            color="text.secondary" 
            textAlign="center"
          >
            © {new Date().getFullYear()} FeedbackPortal. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}