import React from "react";

type LogoProps = {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8"}) => {
    return (
        <img
            src="/image/logo.png"
            alt="logo"
            className={className}
        />
    );
};