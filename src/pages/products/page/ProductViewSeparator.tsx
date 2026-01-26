import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, ENDPOINTS } from "../../../api/apiConfig";
import LanguageSwitcher from "../../../components/languageSwitcher/LanguageSwitcher";
import { useAuthContext } from "../../../contexts/AuthContext";
import { ProductColorDto } from "../../../dto/ProductColorDto";
import { ProductConstructionInfoDto } from "../../../dto/ProductConstructionInfoDto";
import { ProductDto } from "../../../dto/ProductDto";
import { ProductSizeDto } from "../../../dto/ProductSizeDto";
import { ProductTypeDto } from "../../../dto/ProductTypeDto";
import { UserRole } from "../../../dto/UserRole";
import { useProtectedAxios } from "../../../hooks/useProtectedAxios";
import ProductAdminView from "../components/ProductAdminView";
import ProductUserView from "../components/ProductUserView";

type ImageThumbnailType = (
  imageKey: string,
  imageUrl: string,
  isNewImage: boolean,
  prefix?: React.ReactNode | null,
  controls?: React.ReactNode | null,
) => React.ReactNode;

export interface ProductAdminViewProps {
  allTypes: ProductTypeDto[];
  allColors: ProductColorDto[];
  allSizes: ProductSizeDto[];
  product: ProductDto | null;
  existingImageMap: Record<string, string>;
  selectedColorId: number | null;
  imageThumbnail: ImageThumbnailType;
  mainImageThumbnail: (src: string) => React.ReactNode;
  selectedImageKey: string;
  imageLoading: boolean;
  isProductImageColorBound: boolean;
  handleColorSelect: (colorId: number) => void;
}

export interface ProductUserViewProps {
  product: ProductDto | null;
}

const ProductViewSeparator: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const productId = useParams<{ id: string }>();
  const axios = useProtectedAxios();
  const { isAuthenticated, user } = useAuthContext();

  ////////////
  // States //
  ////////////

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [isProductFormFetched, setIsProductFormFetched] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allTypes, setAllTypes] = useState<ProductTypeDto[]>([]);
  const [allColors, setAllColors] = useState<ProductColorDto[]>([]);
  const [allSizes, setAllSizes] = useState<ProductSizeDto[]>([]);
  const [existingImageMap, setExistingImageMap] = useState<
    Record<string, string>
  >({}); // Map of imageId to Blob URL
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [selectedImageKey, setSelectedImageKey] =
    useState<string>("existing-image-0");
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [isProductImageColorBound, setIsProductImageColorBound] =
    useState<boolean>(false);

  const areImagesProcessed =
    Object.keys(existingImageMap).length ===
    Object.keys(product?.images || {}).length;

  // Fetch information about the product and all existing types in the database
  useEffect(() => {
    setLoading(true);
    // Create an array of API requests
    const requests: Promise<any>[] = [
      axios.get<ProductDto>(BASE_URL + ENDPOINTS.products + `/${productId}`),
    ];

    // Determine if user is admin and push new request to array
    const isAdmin = isAuthenticated() && user?.role === UserRole.ADMIN;
    if (isAdmin) {
      setIsAdmin(true);
      requests.push(
        axios.get<ProductConstructionInfoDto>(
          BASE_URL + ENDPOINTS.product_info,
        ),
      );
    }

    // Execute all requests
    Promise.all(requests)
      .then((responses) => {
        const productResponse: { data: ProductDto } = responses[0];
        setProduct(productResponse.data);

        const areImagesColorBound: boolean =
          productResponse.data?.images?.some(
            (img) => img.colorId !== null || img.colorId !== undefined,
          ) ?? false;
        setIsProductImageColorBound(areImagesColorBound);

        // Set admin-specific data
        if (isAdmin && responses[1]) {
          const infoRes: { data: ProductConstructionInfoDto } = responses[1];
          setAllTypes(infoRes.data.types || []);
          setAllColors(infoRes.data.colors || []);
          setAllSizes(infoRes.data.sizes || []);
        }

        setIsProductFormFetched(true);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      })
      .finally(() => setLoading(false));
  }, [productId, axios, isAuthenticated, user]);

  // Fetch and process product images when productForm is fetched
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      const fetchImages = async () => {
        setImageLoading(true);
        const imgMap: Record<string, string> = {};
        try {
          await Promise.all(
            (product.images ?? []).map(async (img) => {
              if (img.imageId) {
                const response = await fetch(
                  BASE_URL + ENDPOINTS.product_images + `/${img.imageId}`,
                );
                if (response.ok) {
                  const blob = await response.blob();
                  imgMap[`existing-image-${img.imageId}`] =
                    URL.createObjectURL(blob);
                }
              }
            }),
          );

          if (product.images) {
            setImagesLoaded(0); // Reset when new images are set
            setExistingImageMap(imgMap);
            if (
              product?.images?.length > 0 &&
              product?.images[0]?.imageId &&
              imgMap[`existing-image-${product?.images[0]?.imageId}`]
            ) {
              setSelectedImageKey(
                `existing-image-${product?.images[0]?.imageId}`,
              );
              setImagesLoaded(product?.images?.length);
            }
          }
          setImageLoading(false);
        } catch (error) {
          console.error("Error fetching images:", error);
          setImageLoading(false);
        }
      };

      fetchImages();
    }
  }, [isProductFormFetched]);

  ///////////////
  // Functions //
  ///////////////

  // TODO: More work on this function. Such as image filtering based on selected color
  const handleColorSelect = (colorId: number) => {
    setSelectedColorId(colorId);
  };

  ///////////
  // Nodes //
  ///////////

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
  const imageThumbnail: ImageThumbnailType = (
    imageKey,
    imageUrl,
    isNewImage,
    prefix,
    controls,
  ) => (
    <Box
      key={imageKey}
      sx={{
        maxWidth: 250,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      {prefix}
      <motion.img
        src={imageUrl}
        alt={t("page.products.details.thumbnailAlt")}
        onClick={() => setSelectedImageKey(imageKey)}
        style={{
          cursor: "pointer",
          borderRadius: 8,
          border:
            imageKey === selectedImageKey
              ? "3px solid #b30b6dff"
              : "3px solid transparent",
          width: 60,
          height: 60,
          objectFit: "cover",
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      />

      {/* For Admin: Select image color or delete image */}
      {controls}
    </Box>
  );

  const mainImageThumbnail = (src: string) => (
    <AnimatePresence mode="wait">
      <motion.img
        src={src}
        alt={t("page.products.details.mainImageAlt")}
        style={{
          maxWidth: "100%",
          maxHeight: 500,
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3 }}
      />
    </AnimatePresence>
  );

  return (
    <Box sx={{ padding: 2 }}>
      {/* Top Bar with Back Button and Language Switcher */}
      {!loading && TopBar}

      {/* Loading Spinner */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 8,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Product View */}

      {isAdmin && areImagesProcessed ? (
        <ProductAdminView
          allTypes={allTypes}
          allColors={allColors}
          allSizes={allSizes}
          product={product}
          existingImageMap={existingImageMap}
          selectedColorId={selectedColorId}
          imageThumbnail={imageThumbnail}
          mainImageThumbnail={mainImageThumbnail}
          selectedImageKey={selectedImageKey}
          imageLoading={imageLoading}
          isProductImageColorBound={isProductImageColorBound}
          handleColorSelect={handleColorSelect}
        />
      ) : (
        areImagesProcessed && <ProductUserView product={product} />
      )}
    </Box>
  );
};

export default ProductViewSeparator;
