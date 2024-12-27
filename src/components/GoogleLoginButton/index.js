import React from "react";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { googleLogin } from "redux/slice/auth";
import axios from "axios";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Dapatkan idToken menggunakan access_token
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          },
        );
        dispatch(googleLogin(userInfo.data));
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: () => {
      console.log("Google Login Failed");
    },
  });

  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={() => login()}
      fullWidth
      className="mt-4"
      sx={{
        textTransform: "none",
        borderColor: "#dadce0",
        color: "#3c4043",
        "&:hover": {
          borderColor: "#d2e3fc",
          backgroundColor: "#f8faff",
        },
      }}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
