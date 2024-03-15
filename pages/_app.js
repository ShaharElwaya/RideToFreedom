// _app.js

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./api/theme/theme";
import "../styles/globals.css";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/router";
import { userStore } from "@/stores/userStore";
import { UserListener } from "@/stores/userListener";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { is_logged_in } = userStore.getState();

  // Handle Logged-in global state
  useEffect(() => {
    if (!is_logged_in) {
      router.replace("/login");
    }
  }, [is_logged_in]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppCacheProvider {...props}>
        <UserListener />
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CacheProvider value={cacheRtl}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {isClient && <Component {...pageProps} />}
          </CacheProvider>
        </ThemeProvider>
      </AppCacheProvider>
    </LocalizationProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
