import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProtectedAxios } from "./useProtectedAxios";

/**
 * Custom hook that fetches data on url param change.
 */
const useFetchOnUrlChange = (endpoint: string): [any, boolean, string] => {
  const protectedAxios = useProtectedAxios();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      setData(null);
      setLoading(true);
      setError("");
      try {
        // uncomment to manually test slow connection
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const { data } = await protectedAxios.get(endpoint, {
          params: {...searchParams}, //might not work as intended
          //params: Object.fromEntries([...searchParams]),
        });
        setData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [endpoint, protectedAxios, searchParams]);

  return [data, loading, error];
};

export default useFetchOnUrlChange;
