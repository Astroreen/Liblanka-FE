const isDevelopment = process.env.NODE_ENV === "development";

export const BASE_URL = isDevelopment
    ? "http://localhost:8080/api/v1"
    : ""; //url to api

export const ENDPOINTS = {
    login: "/auth/login",
    products: "/storage/products",
    product_types: "/storage/products/types",
    product_sizes: "/storage/products/sizes",
    all_product_info: "/storage/products/all-information",
    userDetails: "/user/details",
};
