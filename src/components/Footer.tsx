import React from "react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();
    // Replace {year} in the translation string
    const footerText = t("common.footer").replace("{year}", year.toString());
    const iconsText = t("common.footer_icons");

    return (
        <footer style={{ width: '100%', textAlign: 'center', padding: '1rem 0', background: '#d8d8d8', color: '#333', fontSize: '0.95rem' }}>
            <div>{footerText}</div>
            <div style={{ fontSize: '0.92em', color: '#555', marginTop: '0.2em' }}>{iconsText}</div>
        </footer>
    );
};

export default Footer; 