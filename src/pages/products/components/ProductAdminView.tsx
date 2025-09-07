import {
    Box,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { t } from "i18next";
import React from "react";
import { ProductColorDto } from "../../../dto/ProductColorDto";
import { ProductSizeDto } from "../../../dto/ProductSizeDto";
import { ProductTypeDto } from "../../../dto/ProductTypeDto";
import { ProductDto } from "../../../dto/ProductDto";

export interface ProductAdminViewProps {
    allTypes: ProductTypeDto[];
    allColors: ProductColorDto[];
    allSizes: ProductSizeDto[];
    product: ProductDto | null;
    imageThumbnails: (
        images: { id: number; url: string }[],
        controls: React.ReactNode
    ) => React.ReactNode;
}

const ProductAdminView: React.FC<ProductAdminViewProps> = ({
    allTypes,
    allColors,
    allSizes,
    product,
    imageThumbnails,
}) => {
    // Handle Functions
    const handleDeleteImage = (imageId: number, isNew: boolean = false) => {};
    const handleImageColorChange = (
        imageId: number,
        colorId: number | null
    ) => {};

    const imageThumbnailControl = (id: number) => (
        <>{/* Add your controls for each image thumbnail here */}</>
    );

    const createdImageThumbnail = (
        imageId: number,
        colorId: number,
        fileName: string
    ) => (
        <Box
            key={imageId}
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
        >
            <Typography variant="caption">{fileName}</Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                    value={colorId ?? ""}
                    onChange={(e) =>
                        handleImageColorChange(
                            imageId,
                            e.target.value === ""
                                ? null
                                : Number(e.target.value)
                        )
                    }
                    displayEmpty
                >
                    {/* Dummy Item */}
                    <MenuItem value="">
                        {t("page.products.details.colors")}
                    </MenuItem>

                    {/* Color Options */}
                    {allColors?.map((color) => (
                        <MenuItem key={color.id} value={color.id}>
                            {color.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteImage(imageId, true)}
            >
                <DeleteIcon />
            </IconButton>
        </Box>
    );

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

export default ProductAdminView;
