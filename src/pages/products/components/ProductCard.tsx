import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { ProductCardDto } from "../../../dto/ProductCardDto";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  product: ProductCardDto;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "scale(1.02)",
          transition: "transform 0.2s ease-in-out",
        },
      }}
    >
      {product.imageData ? (
        <CardMedia
          component="img"
          height="200"
          image={`data:image/jpeg;base64,${product.imageData}`}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.200",
          }}
        >
          <ImageNotSupportedIcon sx={{ fontSize: 60, color: "grey.400" }} />
          <Typography sx={{ mt: 1, color: "grey.500" }}>
            {t("page.products.card.imageNotAvailable")}
          </Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          align="center"
          sx={{ fontWeight: "bold" }}
        >
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
          <Typography variant="h6" color="primary">
            {product.price.toFixed(2)}&euro;
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
