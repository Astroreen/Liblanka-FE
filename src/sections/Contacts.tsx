import {useTranslation} from "react-i18next";
import {Constants} from "../Constants";

export const Contacts = () => {
    const { t } = useTranslation();

    return (
        <section
            className="flex flex-col justify-center items-center w-full h-screen bg-[#d8d8d8]"
            id="contacts"
        >
            <h2
                className="text-center text-2xl font-bold mb-4 uppercase"
            >{t("page.header.contacts")}</h2>

            <div
                className="container h-1/2 flex flex-col md:flex-row flex-nowrap gap-5 p-6"
            >
                {/* Map */}
                <iframe
                    title="Contacts"
                    allowFullScreen
                    className="w-full h-full box-border rounded-2xl border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d144.18396082027!2d25.265347454698283!3d54.675425008156886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd95003bf74b3d%3A0x42980d839bde006a!2sUAB%20Liblanka!5e0!3m2!1sru!2slt!4v1709738277384!5m2!1sru!2slt"
                ></iframe>

                {/* Contact Info */}
                <div
                    className="flex flex-col justify-around content-around h-full w-full text-white"
                >
                    {/* Location */}
                    <div
                        className="flex flex-row flex-nowrap items-center h-1/4 bg-[#2d2e31] box-border rounded-xl text-center p-4"
                    >
                        <div
                            className="w-1/6 shrink-0 box-border border-spacing-1 rounded-xl border-white"
                        >
                            <img
                                alt="Location icon"
                                className="max-w-[60px]"
                                src={process.env.PUBLIC_URL + "/image/svg/common/location.svg"}
                            />
                        </div>

                        <p
                            className="w-full shrink text-sm sm:text-lg md:text-xl font-comfortaa"
                        >
                            {Constants.WORK_LOCATION}
                        </p>
                    </div>
                    {/* Phone */}
                    <div
                        className="flex flex-row flex-nowrap items-center h-1/4 bg-[#2d2e31] box-border rounded-xl text-center p-4"
                    >
                        <div
                            className="w-1/6 shrink-0 box-border border-spacing-1 rounded-xl border-white"
                        >
                            <img
                                alt="Phone icon"
                                className="max-w-[60px]"
                                src={process.env.PUBLIC_URL + "/image/svg/common/phone.svg"}
                            />
                        </div>

                        <p
                            className="w-full shrink text-sm sm:text-lg md:text-xl font-comfortaa"
                        >
                            {Constants.WORK_PHONE}
                        </p>
                    </div>
                    {/* Email */}
                    <div
                        className="flex flex-row flex-nowrap items-center h-1/4 bg-[#2d2e31] box-border rounded-xl text-center p-4"
                    >
                        <div
                            className="w-1/6 shrink-0 box-border border-spacing-1 rounded-xl border-white"
                        >
                            <img
                                alt="Mail icon"
                                className="max-w-[60px]"
                                src={process.env.PUBLIC_URL + "/image/svg/common/mail.svg"}
                            />
                        </div>

                        <p
                            className="w-full shrink text-sm sm:text-lg md:text-xl font-comfortaa"
                        >
                            {Constants.WORK_EMAIL}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}