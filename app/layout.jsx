'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./Components/NavBar";
import { AuthContextProvider } from "./Context/AuthContext";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <NavBar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
