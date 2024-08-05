import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Button, Container, Box } from "@mui/material";
import { UserAuth } from "../Context/AuthContext";

const NavBar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn(); // Assuming googleSignIn is a function that handles the sign-in process
    } catch (error) {
      console.error("Sign-in error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        alert("Sign-in process was interrupted. Please try again.");
      } else if (error.code === 'auth/network-request-failed') {
        alert("Network error. Please check your internet connection and try again.");
      } else {
        alert("An error occurred during sign-in. Please try again later.");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      window.location.reload()
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };

    checkAuthentication();
  }, [user]);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#F6F5F3', 
        color: '#333131',
      }}
    >
      <Toolbar variant="dense">
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between', // Space between left and right items
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Left side with Home, Profile and Recipe links */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="/" passHref>
                <Button
                  sx={{
                    color: '#333131', // White text color
                    '&:hover': {
                      backgroundColor: '#E6E2DA', // Darker shade for hover effect
                    },
                  }}
                >
                  Home
                </Button>
              </Link>

              <Link href="/recipe" passHref>
                <Button
                  sx={{
                    color: '#333131', // White text color
                    '&:hover': {
                      backgroundColor: '#E6E2DA', // Darker shade for hover effect
                    },
                  }}
                >
                  Recipe
                </Button>
              </Link>
              <Link href="/profile" passHref>
                <Button
                  sx={{
                    color: '#333131', // White text color
                    '&:hover': {
                      backgroundColor: '#E6E2DA', // Darker shade for hover effect
                    },
                  }}
                >
                  Profile
                </Button>
              </Link>

      
            </Box>

            {/* Right side with Login and Sign Up buttons or user info */}
            {loading ? null : !user ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  sx={{
                    color: '#333131', // White text color
                    '&:hover': {
                      backgroundColor: '#E6E2DA', // Darker shade for hover effect
                    },
                  }}
                  onClick={handleSignIn}
                >
                  Login
                </Button>
                <Button
                  sx={{
                    color: '#333131', // White text color
                    '&:hover': {
                      backgroundColor: '#E6E2DA', // Darker shade for hover effect
                    },
                  }}
                  onClick={handleSignIn}
                >
                  Sign Up
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <p>Welcome, {user.displayName}</p>
                <Button
                  sx={{
                    color: '#333131', // White text color
                    '&:hover': {
                      backgroundColor: '#E6E2DA', // Darker shade for hover effect
                    },
                  }}
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;