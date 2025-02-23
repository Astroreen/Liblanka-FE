import React, {useEffect, useReducer} from "react";
import {useAuthContext} from "../../contexts/AuthContext";
import "./Login.css";
import {initialLoginState, LoginAction, loginReducer, LoginStatus,} from "../../reducers/loginReducer";
import {Alert, Fade} from "@mui/material";
import {Loader} from "../../components/loader/Loader";
import {AuthForm, AuthFormProps} from "../../components/authForm/AuthForm";
import {useNavigate} from "react-router-dom";
import {Logo} from "../../components/logo/Logo";
import {RoutePath} from "../../routes/RoutePath";

const ERROR_POPUP_VISIBLE_DURATION = 3000; // 3 seconds
const ERROR_POPUP_FADE_DURATION = 500; // 0.5 seconds

const createLoginFormProps = (
    emailFilled: boolean,
    dispatch: React.Dispatch<LoginAction>
): AuthFormProps => {
    return emailFilled
        ? {
            title: "Sign in",
            subtitle: "Type in your password:",
            placeholder: "password",
            btnText: "Sign in",
            type: "password",
            onSubmit: (value) => {
                dispatch({
                    type: "COMPLETE_STEP",
                    payload: { step: "password", input: value },
                });
            },
        }
        : {
            title: "Sign in",
            subtitle: "Type in your your email:",
            placeholder: "example@email.com",
            btnText: "Continue",
            type: "email",
            onSubmit: (value) => {
                dispatch({
                    type: "COMPLETE_STEP",
                    payload: { step: "email", input: value },
                });
            },
        };
};

export const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuthContext();
    const [state, dispatch] = useReducer(loginReducer, initialLoginState);
    const { email, password, status, message } = state;
    const currentFormProps = createLoginFormProps(!!email, dispatch);

    useEffect(() => {
        if(isAuthenticated()) {
            navigate(RoutePath.HOME, {replace: true});
        }

        const handleLogin = async () => {
            try {
                dispatch({ type: "LOGIN_BEGIN" });
                await login({ email: email, password: password });
                dispatch({ type: "LOGIN_SUCCESS" });
            } catch (err: any) {
                dispatch({
                    type: "LOGIN_ERROR",
                    payload: {
                        message:
                            err.code === "ERR_BAD_REQUEST"
                                ? "Invalid credentials. Please try again."
                                : "Something went wrong. Please try again.",
                    },
                });
            }
        };

        if (status === LoginStatus.SUCCESS) {
            navigate(RoutePath.HOME, {replace: true});
        } else if (status === LoginStatus.INPUTTING && email && password) {
            handleLogin()
        } else if (status === LoginStatus.ERROR) {
            const popupTimer = setTimeout(() => {
                dispatch({ type: "LOGIN_INPUTTING" });
            }, ERROR_POPUP_VISIBLE_DURATION);
            return () => clearTimeout(popupTimer);
        }
    }, [isAuthenticated, email, password, status, login, navigate]);

    const renderContent = () => {
        let content = <Loader />;
        if (status === LoginStatus.ERROR || status === LoginStatus.INPUTTING) {
            content = <AuthForm {...currentFormProps} />;
        }
        return content;
    };

    const renderErrorPopup = (message: string) => {
        return (
            <Fade
                in={status === LoginStatus.ERROR}
                timeout={{
                    enter: ERROR_POPUP_FADE_DURATION,
                    exit: ERROR_POPUP_FADE_DURATION,
                }}
            >
                <Alert severity="error" className="error-popup">
                    {message}
                </Alert>
            </Fade>
        );
    };

    return (
        <>
            <Logo />
            <div className="login-container">
                {renderContent()}
                {renderErrorPopup(message)}
            </div>
        </>
    );
};