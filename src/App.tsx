import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./pages/home/Home";
import translationEN from "./locales/en/translation.json";
import translationLT from "./locales/lt/translation.json";
import translationRU from "./locales/ru/translation.json";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {RoutePath} from "./routes/RoutePath";
import {Products} from "./pages/products/Products";
import {Login} from "./pages/login/Login";
import {AuthProvider} from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import {Dashboard} from "./pages/admin/Dashboard";

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
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={RoutePath.HOME} element={<Home/>}/>
                    <Route path={RoutePath.PRODUCTS} element={<Products/>}></Route>
                    <Route path={RoutePath.LOGIN} element={<Login/>}></Route>

                    <Route path={RoutePath.ADMIN_PANEL} element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }></Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
