import {useTranslation} from "react-i18next";

export const AboutUs = () => {
    const { t } = useTranslation();

    return (
        <section className="w-screen h-screen" id="about">
            {/* Background: colorful circles */}
            <div className="absolute w-full h-full">
                {/* Blue Circles */}
                <img
                    className="absolute -z-[1] fill-transparent w-full h-full"
                    src={process.env.PUBLIC_URL + "/image/svg/about-us/blue-circles.svg"}
                    alt="Blue Circles"
                />

                {/* Red Circles */}
                <img
                    className="absolute -z-[2] fill-transparent w-full h-full"
                    src={process.env.PUBLIC_URL + "/image/svg/about-us/red-circles.svg"}
                    alt="Red Circles"
                />

                {/* Yellow Circles */}
                <img
                    className="absolute -z-[3] fill-transparent w-full h-full"
                    src={process.env.PUBLIC_URL + "/image/svg/about-us/yellow-circles.svg"}
                    alt="Yellow Circles"
                />
            </div>

            <div
                className="flex flex-col justify-center items-center w-full h-full"
                id="about"
            >
                <div
                    className="container lg:max-w-4xl bg-white p-6 md:p-10 box-border rounded-none sm:rounded-xl h-fit"
                >
                    {/* Section header */}
                    <h1
                        className="text-lg sm:text-xl md:text-2xl font-bold mb-4 uppercase text-center font-roboto"
                    >{t("page.main.about.headline")}</h1>

                    {/* Text */}
                    <p
                        className="text-sm sm:text-lg md:text-xl text-justify mb-5 font-comfortaa"
                    >{t("page.main.about.about-us")}</p>

                    <h3
                        className="text-sm sm:text-lg md:text-xl text-center italic font-bold font-rounded mt-5"
                    >{t("common.name") + ' - ' + t("common.slogan-end")}</h3>
                </div>
            </div>

            {/* Section transition: waves */}
            <div className="absolute w-full -z-[1] -translate-y-[200px]">
                <svg
                    className="w-full h-[200px] -scale-y-[1] translate-y-[1px]"
                    preserveAspectRatio="none"
                    viewBox="0 0 1000 200"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 21L15.5 25.3C31 29.7 62 38.3 92.8 39.7C123.7 41 154.3 35 185.2 33C216 31 247 33 278 39.3C309 45.7 340 56.3 371 55.7C402 55 433 43 463.8 46.7C494.7 50.3 525.3 69.7 556.2 79C587 88.3 618 87.7 649 76.3C680 65 711 43 742 34.7C773 26.3 804 31.7 834.8 40C865.7 48.3 896.3 59.7 927.2 61C958 62.3 989 53.7 1004.5 49.3L1020 45L1020 0L1004.5 0C989 0 958 0 927.2 0C896.3 0 865.7 0 834.8 0C804 0 773 0 742 0C711 0 680 0 649 0C618 0 587 0 556.2 0C525.3 0 494.7 0 463.8 0C433 0 402 0 371 0C340 0 309 0 278 0C247 0 216 0 185.2 0C154.3 0 123.7 0 92.8 0C62 0 31 0 15.5 0L0 0Z"
                        fill="#d8d8d8"
                    ></path>
                    <path
                        d="M0 57L15.5 61.7C31 66.3 62 75.7 92.8 75.7C123.7 75.7 154.3 66.3 185.2 63.7C216 61 247 65 278 68.7C309 72.3 340 75.7 371 75.3C402 75 433 71 463.8 74.7C494.7 78.3 525.3 89.7 556.2 100.3C587 111 618 121 649 110.7C680 100.3 711 69.7 742 56.3C773 43 804 47 834.8 55.7C865.7 64.3 896.3 77.7 927.2 84.3C958 91 989 91 1004.5 91L1020 91L1020 43L1004.5 47.3C989 51.7 958 60.3 927.2 59C896.3 57.7 865.7 46.3 834.8 38C804 29.7 773 24.3 742 32.7C711 41 680 63 649 74.3C618 85.7 587 86.3 556.2 77C525.3 67.7 494.7 48.3 463.8 44.7C433 41 402 53 371 53.7C340 54.3 309 43.7 278 37.3C247 31 216 29 185.2 31C154.3 33 123.7 39 92.8 37.7C62 36.3 31 27.7 15.5 23.3L0 19Z"
                        fill="#e1e1e1"
                    ></path>
                    <path
                        d="M0 101L15.5 107.7C31 114.3 62 127.7 92.8 122.3C123.7 117 154.3 93 185.2 86.3C216 79.7 247 90.3 278 98.3C309 106.3 340 111.7 371 112C402 112.3 433 107.7 463.8 112.7C494.7 117.7 525.3 132.3 556.2 140C587 147.7 618 148.3 649 137.3C680 126.3 711 103.7 742 97.7C773 91.7 804 102.3 834.8 112.3C865.7 122.3 896.3 131.7 927.2 132.3C958 133 989 125 1004.5 121L1020 117L1020 89L1004.5 89C989 89 958 89 927.2 82.3C896.3 75.7 865.7 62.3 834.8 53.7C804 45 773 41 742 54.3C711 67.7 680 98.3 649 108.7C618 119 587 109 556.2 98.3C525.3 87.7 494.7 76.3 463.8 72.7C433 69 402 73 371 73.3C340 73.7 309 70.3 278 66.7C247 63 216 59 185.2 61.7C154.3 64.3 123.7 73.7 92.8 73.7C62 73.7 31 64.3 15.5 59.7L0 55Z"
                        fill="#ebebeb"
                    ></path>
                    <path
                        d="M0 131L15.5 135C31 139 62 147 92.8 142.7C123.7 138.3 154.3 121.7 185.2 118.3C216 115 247 125 278 129C309 133 340 131 371 128.3C402 125.7 433 122.3 463.8 130C494.7 137.7 525.3 156.3 556.2 163.7C587 171 618 167 649 157.3C680 147.7 711 132.3 742 127C773 121.7 804 126.3 834.8 133C865.7 139.7 896.3 148.3 927.2 149.3C958 150.3 989 143.7 1004.5 140.3L1020 137L1020 115L1004.5 119C989 123 958 131 927.2 130.3C896.3 129.7 865.7 120.3 834.8 110.3C804 100.3 773 89.7 742 95.7C711 101.7 680 124.3 649 135.3C618 146.3 587 145.7 556.2 138C525.3 130.3 494.7 115.7 463.8 110.7C433 105.7 402 110.3 371 110C340 109.7 309 104.3 278 96.3C247 88.3 216 77.7 185.2 84.3C154.3 91 123.7 115 92.8 120.3C62 125.7 31 112.3 15.5 105.7L0 99Z"
                        fill="#f5f5f5"
                    ></path>
                </svg>
            </div>
        </section>
    )
}