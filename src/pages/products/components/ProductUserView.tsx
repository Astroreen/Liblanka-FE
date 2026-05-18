import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductUserViewProps } from "../page/ProductViewSeparator";

const ProductUserView: React.FC<ProductUserViewProps> = ({
  product,
  isAdmin,
  onEdit,
  existingImageMap,
  imageThumbnail,
  mainImageThumbnail,
  selectedImageKey,
  imageLoading,
  selectedColorId,
  handleColorSelect,
  isProductImageColorBound,
}) => {
  const { t } = useTranslation();
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

  const variants =
    selectedColorId && product?.variantsByColor
      ? product?.variantsByColor[selectedColorId] || []
      : product?.variants || [];
  const selectedVariant = variants?.find((v) => v.sizeId === selectedSizeId);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, gap: 2, flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", sm: "column" },
            gap: 1.5,
            overflowX: "auto",
          }}
        >
          <AnimatePresence>
            {!imageLoading &&
              product?.images?.map((img) =>
                imageThumbnail(
                  `existing-image-${img.imageId}`,
                  existingImageMap[`existing-image-${img.imageId}`],
                  false,
                  null,
                  null
                )
              )}
          </AnimatePresence>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {!imageLoading && selectedImageKey && mainImageThumbnail(existingImageMap[selectedImageKey] || "")}
        </Box>
      </Box>

      <Paper elevation={0} sx={{ flex: 1, p: 4, borderRadius: 4, minWidth: 350, border: "1px solid #eaeaea" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            {product?.name}
          </Typography>
          {isAdmin && (
            <IconButton onClick={onEdit} color="primary">
              <EditIcon />
            </IconButton>
          )}
        </Box>

        <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ mb: 4 }}>
          {product?.price}&euro;
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
          {product?.description}
        </Typography>

        {product?.type && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {t("page.products.details.type")}
            </Typography>
            <Typography>{product.type.name}</Typography>
          </Box>
        )}

        {product?.attributes && product.attributes.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {t("page.products.details.attributes")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {product.attributes.map((attr, i) => (
                <Chip key={i} label={attr} variant="outlined" size="small" />
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {t("page.products.details.colors")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {product?.colors?.map((color) => (
              <Button
                key={color.id}
                onClick={() => handleColorSelect(color.id!)}
                disabled={!isProductImageColorBound}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: color.hex,
                  p: 0,
                  border: selectedColorId === color.id ? "3px solid #333" : "1px solid #ccc",
                  boxShadow: selectedColorId === color.id ? "0 0 0 2px #fff inset" : "none",
                  "&:hover": { background: color.hex, opacity: 0.8 },
                }}
                title={color.name}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {t("page.products.details.sizes")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {product?.sizes
              ?.filter((size) => {
                if (!selectedColorId || !product.variantsByColor) return true;
                const variants = product.variantsByColor[selectedColorId] || [];
                return variants.some((v) => v.sizeId === size.id && v.quantity > 0);
              })
              .map((size) => (
                <Chip
                  key={size.id}
                  label={size.name}
                  onClick={() => setSelectedSizeId(size.id!)}
                  color={selectedSizeId === size.id ? "primary" : "default"}
                  variant={selectedSizeId === size.id ? "filled" : "outlined"}
                  sx={{ borderRadius: 1, px: 1 }}
                />
              ))}
          </Box>
        </Box>

        {selectedVariant && (
          <Typography variant="body2" color="success.main" sx={{ mb: 3 }}>
            {t("page.products.details.quantity")}: {selectedVariant.quantity}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProductUserView;
