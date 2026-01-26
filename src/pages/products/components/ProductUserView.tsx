import { Box } from "@mui/material";
import React from "react";
import { ProductUserViewProps } from "../page/ProductViewSeparator";

const ProductUserView: React.FC<ProductUserViewProps> = (inputs) => {
  return (
    <>
      {/* Sidebar Thumbnails */}
      <Box
        sx={{
          minWidth: 80,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {}
      </Box>
    </>
  );
};

export default ProductUserView;
