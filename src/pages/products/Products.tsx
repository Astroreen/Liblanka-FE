import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { ProductFilter } from "./components/ProductFilter";
import { ProductCard } from "./components/ProductCard";
import { ProductCardDto } from "../../dto/ProductCardDto";
import { useProtectedAxios } from "../../hooks/useProtectedAxios";
import { ENDPOINTS } from "../../api/apiConfig";
import { Logo } from "../../components/logo/Logo";
import Button from "@mui/material/Button";
import LanguageSwitcher from "../../components/languageSwitcher/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

interface FilterParams {
  name?: string;
  typeId?: number;
  sizeIds?: number[];
  colorIds?: number[];
  page?: number;
  pageSize?: number;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const Products: React.FC = () => {
  const { t } = useTranslation();
  const protectedAxios = useProtectedAxios();
  const [products, setProducts] = useState<ProductCardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<
    Omit<FilterParams, "page" | "pageSize">
  >({});
  const navigate = useNavigate();

  const fetchProducts = async (params: FilterParams) => {
    try {
      setLoading(true);
      // Convert array parameters to comma-separated strings
      const encodedParams = {
        ...params,
        sizeIds: params.sizeIds?.join(","),
        colorIds: params.colorIds?.join(","),
      };

      const response = await protectedAxios.get<PageResponse<ProductCardDto>>(
        ENDPOINTS.products_filter,
        { params: encodedParams }
      );

      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    filterParams: Omit<FilterParams, "page" | "pageSize">
  ) => {
    setCurrentFilter(filterParams);
    setCurrentPage(0);
    fetchProducts({ ...filterParams, page: 0, pageSize: 20 });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page - 1);
    fetchProducts({ ...currentFilter, page: page - 1, pageSize: 20 });
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchProducts({ page: 0, pageSize: 20 });
    // eslint-disable-next-line
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <>
      <Helmet>
        <title>{t("page.products.title")}</title>
      </Helmet>

      <Box sx={{ display: "flex" }}>
        <ProductFilter onFilterChange={handleFilterChange} />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            width: '100%',
            mb: 5,
          }}>
            <Button
              onClick={() => (window.location.href = "/")}
              sx={{
                background: "none",
                boxShadow: "none",
                p: 0,
                "&:hover": { background: "none" },
              }}
            >
              <Logo />
            </Button>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              sx={{
                fontWeight: "bold",
                letterSpacing: 2,
                whiteSpace: "nowrap",
                flex: '1 1 auto',
                minWidth: 'fit-content',
              }}
            >
              {t("page.products.our_products")}
            </Typography>
            <Box sx = {{ minWidth: 173.67, display: "flex", justifyContent: "center" }}>
              <LanguageSwitcher />
            </Box>
          </Box>

          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 24px)",
                    md: "calc(33.333% - 24px)",
                    lg: "calc(25% - 24px)",
                  },
                }}
              >
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                />
              </Box>
            ))}
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};
