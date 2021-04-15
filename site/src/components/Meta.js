import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = () => (
  <Helmet>
    <title>Purify - Functional programming library for TypeScript</title>
    <meta
      name="description"
      content="Purify - Functional programming library for TypeScript"
    />
    <meta
      name="keywords"
      content="typescript,functional programming,library,javascript"
    />
    <meta name="theme-color" content="#3b74d7" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <link
      rel="icon"
      type="image/png"
      href="./images/favicon.png"
      sizes="16x16"
    />
  </Helmet>
)

export default Meta
