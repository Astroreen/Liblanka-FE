import React from "react";
import {AboutUs} from "./sections/AboutUs";
import {Contacts} from "./sections/Contacts";
import {HomeHeader} from "./sections/HomeHeader";
import {Helmet} from 'react-helmet'
import {useTranslation} from "react-i18next";

export const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t("page.main.title")}</title>
            </Helmet>
            <HomeHeader/>
            <AboutUs/>
            <Contacts/>
        </>
    )
}