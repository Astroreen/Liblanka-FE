import React from "react";
import ReactDOM from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import reportWebVitals from "./utils/reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      {/*Header on all pages*/}
      <Helmet>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          {/* Google Fonts */}
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link
            crossOrigin="anonymous"
            href="https://fonts.gstatic.com"
            rel="preconnect"
          />
        </Helmet>

        <App />
    </HelmetProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
