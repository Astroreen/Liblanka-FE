import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import translationEN from "./locales/en/translation.json";
import translationLT from "./locales/lt/translation.json";
import translationRU from "./locales/ru/translation.json";
import { Dashboard } from "./pages/admin/Dashboard";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";
import ProductProfile from "./pages/products/page/ProductProfile";
import { Products } from "./pages/products/Products";
import ProtectedRoute from "./routes/ProtectedRoute";
import { RoutePath } from "./routes/RoutePath";

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
                    <Route path="/products/:id" element={<ProductProfile />} />
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
