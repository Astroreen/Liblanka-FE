const isDevelopment = process.env.NODE_ENV === "development";

export const BASE_URL = isDevelopment
  ? "http://localhost:8080/api/v1"
  : "https://www.liblanks.lt/api/v1"; //url to api

export const ENDPOINTS = {
  login: "/auth/login",
  products: "/storage/products",
  product_types: "/storage/products/types",
  product_sizes: "/storage/products/sizes",
  product_colors: "/storage/products/colors",
  product_info: "/storage/products/information",
  products_filter: "/storage/products/filter",
  userDetails: "/user/details",
};
