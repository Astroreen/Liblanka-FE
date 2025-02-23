import React, {useState} from "react";
import "./AuthForm.css";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {Button, TextField} from "@mui/material";

export interface AuthFormProps {
    title: string;
    subtitle: string;
    placeholder: string;
    btnText: string;
    type: string;
    onSubmit: (value: string) => void;
}

export const AuthForm = ({
                             title,
                             subtitle,
                             placeholder,
                             btnText,
                             type,
                             onSubmit,
                         }: AuthFormProps) => {
    const {t} = useTranslation();
    const [input, setInput] = useState("");

    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!input) return;
        onSubmit(input);
        setInput("");
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    return (
        <>
            <Helmet>
                <title>{t("page.login.title")}</title>

                {/* Bootstrap */}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                    crossOrigin="anonymous"
                />
            </Helmet>

            <main className="form-signin w-100 m-auto">
                <h1>{title}</h1>
                <p className="mt-3 mb-2">{subtitle}</p>
                <form onSubmit={handleOnSubmit}>
                    <TextField
                        className="form-floating mb-3"
                        type={type}
                        placeholder={placeholder}
                        fullWidth={true}
                        value={input}
                        onChange={handleOnChange}
                        size="small"
                    />
                    <Button type="submit" fullWidth variant="contained">
                        {btnText}
                    </Button>
                    <p className="mt-5 mb-3 text-body-secondary">&copy; 2024–{new Date().getFullYear()}</p>
                </form>
            </main>
            <script src="/docs/5.3/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                    crossOrigin="anonymous"></script>
        </>
    );
};
