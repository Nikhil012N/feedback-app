import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { CssBaseline } from "@mui/material";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Feedback Portal",
  description: "A client feedback portal built with the MERN stack",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <CssBaseline />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
