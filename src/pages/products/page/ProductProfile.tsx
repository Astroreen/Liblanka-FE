import { Box, CircularProgress, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProtectedAxios } from "../../../hooks/useProtectedAxios";
import { useAuthContext } from "../../../contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSwitcher from "../../../components/languageSwitcher/LanguageSwitcher";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { BASE_URL, ENDPOINTS } from "../../../api/apiConfig";
import { ProductConstructionInfoDto } from "../../../dto/ProductConstructionInfoDto";
import { ProductDto } from "../../../dto/ProductDto";
import { UserRole } from "../../../dto/UserRole";
import ProductUserView from "../components/ProductUserView";
import ProductAdminView from "../components/ProductAdminView";
import { ProductColorDto } from "../../../dto/ProductColorDto";
import { ProductSizeDto } from "../../../dto/ProductSizeDto";
import { ProductTypeDto } from "../../../dto/ProductTypeDto";
import { useTranslation } from "react-i18next";
import { ProductImageDto } from "../../../dto/ProductImageDto";

const ProductProfile: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const axios = useProtectedAxios();
    const { isAuthenticated, user } = useAuthContext();

    // States
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [allTypes, setAllTypes] = useState<ProductTypeDto[]>([]);
    const [allColors, setAllColors] = useState<ProductColorDto[]>([]);
    const [allSizes, setAllSizes] = useState<ProductSizeDto[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<number>(0);
    const [productForm, setProductForm] = useState<ProductDto | null>(null);

    // Fetch information about the product and all existing types in the database
    useEffect(() => {
        setLoading(true);
        // Create an array of API requests
        const requests: Promise<any>[] = [
            axios.get<ProductDto>(BASE_URL + ENDPOINTS.products + `/${id}`),
        ];

        // Determine if user is admin and push new request to array
        const isAdmin = isAuthenticated() && user?.role === UserRole.ADMIN;
        if (isAdmin) {
            setIsAdmin(true);
            requests.push(
                axios.get<ProductConstructionInfoDto>(
                    BASE_URL + ENDPOINTS.product_info
                )
            );
        }

        // Execute all requests
        Promise.all(requests)
            .then((responses) => {
                const productResponse: { data: ProductDto } = responses[0];
                setProductForm(productResponse.data);

                // Set admin-specific data
                if (isAdmin && responses[1]) {
                    const infoRes: { data: ProductConstructionInfoDto } =
                        responses[1];
                    setAllTypes(infoRes.data.types || []);
                    setAllColors(infoRes.data.colors || []);
                    setAllSizes(infoRes.data.sizes || []);
                }

                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id, axios, isAuthenticated, user]);

    // Top Bar with Back Button and Language Switcher
    const TopBar = (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
            }}
        >
            <IconButton onClick={() => navigate("/products")}>
                <ArrowBackIosNewIcon />
            </IconButton>
            <LanguageSwitcher />
        </Box>
    );

    // Image Thumbnails
    const imageThumbnails = (
        images: { id: number; url: string }[],
        controls?: React.ReactNode | null
    ) => (
        <AnimatePresence initial={false}>
            {images.map(({ id, url }) => (
                <Box
                    key={id}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                    <motion.img
                        src={url}
                        alt={t("page.products.details.thumbnailAlt")}
                        onClick={() => setSelectedImageId(id)}
                        style={{
                            cursor: "pointer",
                            borderRadius: 8,
                            border:
                                id === selectedImageId
                                    ? "2px solid #8d6e63"
                                    : "2px solid transparent",
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* For Admin: Select image color or delete */}
                    {controls}
                </Box>
            ))}
        </AnimatePresence>
    );

    return (
        <Box sx={{ padding: 2 }}>
            {/* Top Bar with Back Button and Language Switcher */}
            {TopBar}

            {/* Loading Spinner */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Product View */}
            {isAdmin ? (
                <ProductAdminView
                    allTypes={allTypes}
                    allColors={allColors}
                    allSizes={allSizes}
                    product={productForm}
                    imageThumbnails={imageThumbnails}
                />
            ) : (
                <ProductUserView
                    product={productForm}
                    imageThumbnails={imageThumbnails}
                />
            )}
        </Box>
    );
};

export default ProductProfile;
