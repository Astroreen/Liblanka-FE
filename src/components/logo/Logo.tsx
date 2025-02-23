import React from "react";

type LogoProps = {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "fixed w-fit h-8 mt-4 ml-4"}) => {
    return (
        <img
            src="/image/logo.png"
            alt="logo"
            className={className}
        />
    );
};