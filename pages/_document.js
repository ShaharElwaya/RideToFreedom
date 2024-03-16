// _document.js

import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

import {
  DocumentHeadTags,
  documentGetInitialProps,
} from "@mui/material-nextjs/v13-pagesRouter";
// or `v1X-pagesRouter` if you are using Next.js v1X

class MyDocument extends Document {
  render() {
    return (
      <Html dir="rtl" lang="he">
        <Head>
          <DocumentHeadTags {...this.props} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap"
          ></link>
          {/* ... Other head tags */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};

export default MyDocument;
