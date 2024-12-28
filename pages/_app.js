import React, { useEffect } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

import { wrapper } from "redux/store";
import { verifyToken } from "redux/slice/auth";

import { isBrowser } from "src/utils";

import "styles/globals.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#6C63FF",
      light: "#8B85FF",
    },
    secondary: {
      main: "#845EC2",
    },
    accent: {
      main: "#00C9A7",
    },
    background: {
      default: "#0F1624",
      paper: "#171E31",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B8C1EC",
    },
  },
});

function App({ Component, pageProps }) {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    verifyToken: { loading },
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = isBrowser() && window.localStorage.getItem("token");

    axios.defaults.headers.common = {
      Authorization: "Bearer " + token,
    };

    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <Head>
          <title>Best online courses - Learn to succeed | learnlit</title>
          <meta
            name="description"
            content="Skillopa is an online learning and teaching marketplace with varied courses. Learn programming, software development, marketing, data science and more."
          />
          <meta
            name="title"
            content="Best online courses - Learn to succeed | Skillopa"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#0F1624" />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default wrapper.withRedux(App);
