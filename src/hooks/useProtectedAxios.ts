import axios from "axios";
import { useMemo } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../api/apiConfig";

export const useProtectedAxios = () => {
    const { getAccessToken } = useAuthContext();

    const protectedAxios = useMemo(() => {
        const instance = axios.create({
            baseURL: BASE_URL,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });

        return instance;
    }, [getAccessToken]);

    return protectedAxios;
};
