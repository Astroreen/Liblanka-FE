import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./pages/home/Home";
import translationEN from "./locales/en/translation.json";
import translationLT from "./locales/lt/translation.json";
import translationRU from "./locales/ru/translation.json";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {RoutePath} from "./routes/Routes";

const resources = {
    en: {
        translation: translationEN,
    },
    lt: {
        translation: translationLT,
    },
    ru: {
        translation: translationRU,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem("language") ?? "lt",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path={RoutePath.HOME} element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
