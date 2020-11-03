import React from "react"
import Head from "next/head"
import App from "next/app"

import Store from "../components/Store"

import "../styles/tailwind.css"
import "easymde/dist/easymde.min.css"

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          ></meta>
          {/* General tags */}
          <meta key="description" property="description" content="LiteDocs" />
          <title key="title">LiteDocs</title>
          {/* OpenGraph tags */}
          <meta
            key="og:url"
            property="og:url"
            content="https://github.com/perryraskin/devdocs"
          />
          <meta key="og:title" property="og:title" content="LiteDocs" />
          <meta
            key="og:description"
            property="og:description"
            content="LiteDocs"
          />
          {/* <meta key="og:image" property="og:image" content="" /> */}
          <meta key="og:type" property="og:type" content="website" />
          {/* Twitter Card tags */}
          <meta
            key="twitter:title"
            property="twitter:title"
            content="LiteDocs"
          />
          <meta
            key="twitter:description"
            property="twitter:description"
            content="LiteDocs"
          />
          {/* <meta key="twitter:image" property="twitter:image" content="" /> */}
          <meta key="twitter:card" property="twitter:card" content="summary" />
        </Head>
        <div className="bg-gray-100">
          {/* <Store>
            <Component {...pageProps} />
          </Store> */}
          <Component {...pageProps} />
        </div>
      </>
    )
  }
}

export default MyApp
