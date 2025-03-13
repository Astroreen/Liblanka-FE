import { useState, useEffect } from "react";
import { useProtectedAxios } from "./useProtectedAxios";
import { AxiosRequestConfig } from "axios";

/**
 * Custom hook that fetches data on url param change.
 */
const useFetch = (
  endpoint: string,
  params?: AxiosRequestConfig
): [any, boolean, string] => {
  const protectedAxios = useProtectedAxios();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      setData(null);
      setLoading(true);
      setError("");
      try {
        const { data } = await protectedAxios.get(endpoint, params);
        setData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [endpoint, params, protectedAxios]);

  return [data, loading, error];
};

export default useFetch;
