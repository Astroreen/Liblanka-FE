import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../../../components/languageSwitcher/LanguageSwitcher";
import {RoutePath} from "../../../routes/RoutePath";
import './HomeHeader.css'
import {useAuthContext} from "../../../contexts/AuthContext";
import {UserRole} from "../../../dto/UserRole";

export const HomeHeader = () => {
    const {t} = useTranslation();
    const {isAuthenticated, user} = useAuthContext();


    return (
        <section
            className="flex flex-col gap-5 justify-between items-center h-screen w-screen bg-gradient-to-tr from-[#FF6596] via-[#60BEF8] to-[#D88CFF] bg-gradient-animation animation-duration-15 text-white"
        >
            <header>
                {/* Navigation bar */}
                <nav
                    className="flex flex-row justify-center sm:justify-between items-center flex-wrap sm:flex-nowrap px-6 pt-6 gap-4 w-screen"
                >
                    {/* Links */}
                    <div
                        className="flex flex-row flex-wrap sm:flex-nowrap gap-6 justify-evenly font-comfortaa text-lg sm:text-xl md:text-2xl lg:text-3xl"
                    >
                        <p className="animate-underline cursor-pointer">
                            {t("page.header.home")}
                        </p>

                        <a className="animate-underline" href={RoutePath.PRODUCTS}>
                            {t("page.header.products")}
                        </a>

                        <a className="animate-underline flex-shrink-0" href="/#about">
                            {t("page.header.about")}
                        </a>

                        <a
                            className="animate-underline"
                            href="/#contacts"
                        >{t("page.header.contacts")}</a>

                        {isAuthenticated() && user?.role === UserRole.ADMIN &&
                            <a className="animate-underline" href={RoutePath.ADMIN_PANEL}>
                                {t("page.header.admin_panel")}
                            </a>
                        }
                    </div>

                    <LanguageSwitcher/>
                </nav>
            </header>

            {/* Headline */}
            <div
                className="flex flex-col justify-center content-center text-center h-full w-full px-10 font-pacifico"
            >
                <h1
                    className="text-3xl sm:text-6xl md:text-9xl"
                >{t("common.name")}</h1>
                <h2
                    className="text-xl sm:text-3xl md:text-6xl"
                >{t("common.slogan-end")}</h2>
            </div>

            {/* Section transition: wave */}
            <div
                className="bottom-0 left-0 w-full h-[200px] rotate-180 overflow-hidden leading-[0] translate-y-[1px]"
            >
                <svg
                    className="w-[200%] md:w-[127%] h-[170px]"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        className="fill-white"
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                    ></path>
                </svg>
            </div>
        </section>
    )
}