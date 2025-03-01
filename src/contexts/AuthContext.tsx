import React, {createContext, ReactNode, useContext, useEffect, useState,} from "react";
import axios from "axios";
import {BASE_URL, ENDPOINTS} from "../api/apiConfig";
import {createCookie, createTemporaryCookie, deleteCookie, getCookie} from "../utils/cookie/CookieManager";
import {UserDto} from "../dto/UserDto";
import {CookieSiteType} from "../utils/cookie/CookieSite";

interface LoginProps {
    email: string;
    password: string;
}

interface AuthContextProps {
    isAuthenticated: () => boolean;
    login: (credentials: LoginProps) => void;
    logout: () => void;
    getAccessToken: () => string;
    handleNewToken: (newToken: string) => void;
    user: UserDto | null;
    setUserData: (userDto: UserDto) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const initialAuthContext: AuthContextProps = {
    isAuthenticated: () => false,
    login: () => {},
    logout: () => {},
    getAccessToken: () => "",
    handleNewToken: () => {},
    user: null,
    setUserData: () => {},
};

export const AuthContext = createContext<AuthContextProps>(initialAuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState(getCookie("token") ?? "");
    const [user, setUser] = useState<UserDto | null>(null);

    const isAuthenticated = () => !!accessToken;

    useEffect(() => {
        const token = getCookie("token");
        if (token) {
            setAccessToken(token);
            fetchUser(token);
        }
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const response = await axios.get(BASE_URL + ENDPOINTS.userDetails, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const setUserData = async (userDto: UserDto) => setUser(userDto);

    const getAccessToken = () => accessToken;

    const handleNewToken = (newToken: string) => {
        setAccessToken(newToken);
        createTemporaryCookie("token", newToken, true, CookieSiteType.LAX,1);
    };

    const login = async (loginRequest: LoginProps) => {
        try {
            const { data } = await axios.post(
                BASE_URL + ENDPOINTS.login,
                loginRequest
            );
            setAccessToken(data.token);
            //we will add cookie with user token if it is not set up yet
            //more about cookies in browser: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
            if (!getCookie("token")) createTemporaryCookie("token", data.token, true, CookieSiteType.LAX, 1);
            fetchUser(data.token);
        } catch (err) {
            console.error("Error creating token", err);
        }
    };

    const logout = () => {
        setAccessToken("");
        deleteCookie("token");
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, login, logout, getAccessToken, handleNewToken, user, setUserData }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};
