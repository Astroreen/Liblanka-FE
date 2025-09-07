import { Box } from "@mui/material";
import React from "react";
import { ProductDto } from "../../../dto/ProductDto";

export interface ProductUserViewProps {
    product: ProductDto | null;
    imageThumbnails: (images: {id: number, url: string}[], controls?: React.ReactNode | null) => React.ReactNode;
}

const ProductUserView: React.FC<ProductUserViewProps> = ({ imageThumbnails }) => {
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
