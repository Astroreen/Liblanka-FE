import React from "react";
import {useTranslation} from "react-i18next";


const LanguageSwitcher = () => {
    const {i18n} = useTranslation();

    const switchToLithuanian = () => {
        i18n.changeLanguage("lt");
        localStorage.setItem("language", i18n.language);
    };
    const switchToEnglish = () => {
        i18n.changeLanguage("en");
        localStorage.setItem("language", i18n.language);
    };
    const switchToRussian = () => {
        i18n.changeLanguage("ru");
        localStorage.setItem("language", i18n.language);
    };

    /* Language bar */
    return (
        <div className="flex flex-row gap-2 self-center">
            {/* Lithuanian */}
            {i18n.language !== "lt" &&
                <button onClick={switchToLithuanian}>
                    <img
                        alt="Lithuanian flag"
                        loading="lazy"
                        src={process.env.PUBLIC_URL + '/image/lang/lt.png'}
                    />
                </button>
            }

            {/* English */}
            {i18n.language !== "en" &&
                <button onClick={switchToEnglish}>
                    <img
                        alt="United Kingdom flag"
                        loading="lazy"
                        src={process.env.PUBLIC_URL + '/image/lang/en.png'}
                    />
                </button>
            }

            {/* Russian */}
            {i18n.language !== "ru" &&
                <button onClick={switchToRussian}>
                    <img
                        alt="Russian flag"
                        loading="lazy"
                        src={process.env.PUBLIC_URL + '/image/lang/ru.png'}
                    />
                </button>
            }
        </div>
    )
        ;

};

export default LanguageSwitcher;