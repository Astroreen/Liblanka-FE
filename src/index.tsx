import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './utils/reportWebVitals';
import i18next from "i18next";
import {I18nextProvider} from "react-i18next";
import {Helmet} from "react-helmet";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

i18next.init({
    interpolation: {escapeValue: false}, // React already does escape
});

root.render(
    <React.StrictMode>
        {/*Translator layer*/}
        <I18nextProvider i18n={i18next}>
            {/*Header on all pages*/}
            <Helmet>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

                {/* Google Fonts */}
                <link href="https://fonts.googleapis.com" rel="preconnect"/>
                <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect"/>
            </Helmet>

            <App/>
        </I18nextProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
