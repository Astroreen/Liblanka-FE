import { DownloadDone, Upload, UploadFile } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, CircularProgress, FormControl, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import { useProtectedAxios } from "../../../hooks/useProtectedAxios";
import { BASE_URL, ENDPOINTS } from "../../../api/apiConfig";
import { ProductDto } from "../../../dto/ProductDto";
import { ProductImageDto } from "../../../dto/ProductImageDto";
import { ProductVariantDto } from "../../../dto/ProductVariantDto";
import { ProductAdminViewProps } from "../page/ProductViewSeparator";
import ProductPanelInfo from "./ProductInformationPanel";

export interface ProductForm {
    name: string;
    description: string;
    price: number;
    typeId: number;
    attributes: string[];
    variants: ProductVariantDto[];
}

export interface ProductFormErrors {
    invalidName?: string;
    invalidPrice?: string;
    imageWrongFormat?: string;
}

const ProductAdminView: React.FC<ProductAdminViewProps> = (inputs) => {
    const { t } = useTranslation();
    const axios = useProtectedAxios();
    const { allTypes, allColors, allSizes, imageThumbnail, existingImageMap, selectedImageKey, imageLoading } = inputs;

    ////////////
    // States //
    ////////////

    const [existingImageArray, setExistingImageArray] = React.useState<ProductImageDto[]>(inputs.product?.images || []); // Array of existing image IDs
    const [addedByUserImageMap, setAddedByUserImageMap] = React.useState<Record<string, File>>({}); // Map of newly created images
    const [nextImageId, setNextImageId] = React.useState<number>(Math.max(...existingImageArray.map((img) => img.id ?? 0)) + 1); // Id for newly created images
    const [addedByUserImageColorMap, setAddedByUserImageColorMap] = React.useState<Record<string, number | null>>({}); // Map of colors for newly created images
    const [addedByUserImageFileURLMap, setAddedByUserImageFileURLMap] = React.useState<Record<string, string>>({}); // Map of local file URLs for newly created images
    const [deleteImageArray, setDeleteImageArray] = React.useState<number[]>([]); // Array of images to be deleted (only existing images from DB)
    const [errors, setErrors] = React.useState<ProductFormErrors>({});
    const [productForm, setProductForm] = React.useState<ProductForm | undefined>(
        inputs.product
            ? {
                  name: inputs.product.name,
                  description: inputs.product.description || "",
                  price: inputs.product.price,
                  typeId: inputs.product.type?.id || 0,
                  attributes: inputs.product.attributes || [],
                  variants: inputs.product.variants || [],
              }
            : undefined,
    );

    ///////////////
    // Functions //
    ///////////////

    const revokeImageObjectURL = (imageKey: string) => {
        const url = addedByUserImageFileURLMap ? addedByUserImageFileURLMap[imageKey] : null;
        if (url) {
            URL.revokeObjectURL(url);
            setAddedByUserImageFileURLMap((prev) => {
                const updatedMap = { ...prev };
                delete updatedMap[imageKey];
                return updatedMap;
            });
        }
    };

    const onFormPropsChange = (field: keyof ProductForm, value: any) => {
        setProductForm((prev) => ({ ...prev, [field]: value }) as ProductForm);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const supported = Array.from(files).filter((f) => f.type.startsWith("image/"));
        if (supported.length !== files.length) {
            setErrors((prev) => ({
                ...prev,
                imageWrongFormat: t("page.products.details.imageFormatError"),
            }));
            return;
        } else {
            setErrors((prev) => ({ ...prev, imageWrongFormat: undefined }));
        }

        // Process the supported files here
        let currentId = nextImageId;
        const newImages: Record<string, File> = {};
        const newFileURLs: Record<string, string> = {};
        supported.forEach((file) => {
            const key = `new-image-${currentId}`;
            newImages[key] = file;
            newFileURLs[key] = URL.createObjectURL(file);
            currentId++;
        });
        setNextImageId(currentId);
        setAddedByUserImageMap((prev) => ({ ...prev, ...newImages }));
        setAddedByUserImageFileURLMap((prev) => ({ ...prev, ...newFileURLs }));
    };

    const handleDeleteImage = (imageId: string, isNew: boolean = false) => {
        if (isNew && addedByUserImageMap && addedByUserImageMap[imageId]) {
            const updatedMap = { ...addedByUserImageMap };
            delete updatedMap[imageId];
            setAddedByUserImageMap(updatedMap);
            revokeImageObjectURL(imageId); // Free up memory
            return;
        }

        const filteredImages: ProductImageDto[] | undefined = existingImageArray.filter((img) => img.id !== Number(imageId));
        setExistingImageArray(filteredImages);
        setDeleteImageArray((prev) => [...prev, Number(imageId)]);
    };

    const handleImageColorChange = (imageKey: string, colorId: number | null) => {
        if (colorId === undefined) {
            return;
        }

        const isNewImage = imageKey.startsWith("new-image-");
        if (isNewImage) {
            setAddedByUserImageColorMap((prev) => ({
                ...prev,
                [imageKey]: colorId,
            }));
            return;
        }

        setExistingImageArray((prev) => prev.map((img) => (img.id === Number(imageKey) ? { ...img, colorId } : img)));
    };

    const handleSaveChanges = async () => {
        if (!productForm || !inputs.product?.id) return;

        const formData = new FormData();
        formData.append("name", productForm.name);
        formData.append("typeId", String(productForm.typeId));
        formData.append("price", String(productForm.price));
        if (productForm.description) {
            formData.append("description", productForm.description);
        }
        if (productForm.attributes?.length) {
            formData.append("attributes", JSON.stringify(productForm.attributes));
        }
        formData.append("variants", JSON.stringify(productForm.variants || []));

        Object.entries(addedByUserImageMap).forEach(([key, file]) => {
            formData.append(`newImages[${key}]`, file);
        });

        const newImageMetadata = Object.entries(addedByUserImageColorMap).map(
            ([key, colorId]) => ({ key, colorId }),
        );
        if (newImageMetadata.length) {
            formData.append("newImageMetadata", JSON.stringify(newImageMetadata));
        }

        const colorChangesMap: Record<string, number> = {};
        existingImageArray.forEach((img) => {
            if (img.imageId !== undefined && img.colorId !== null && img.colorId !== undefined) {
                colorChangesMap[String(img.imageId)] = img.colorId;
            }
        });
        if (Object.keys(colorChangesMap).length) {
            formData.append("imageColorChanges", JSON.stringify(colorChangesMap));
        }

        deleteImageArray.forEach((id) => {
            formData.append("deleteImages", String(id));
        });

        try {
            const response = await axios.put<ProductDto>(
                BASE_URL + ENDPOINTS.products + `/${inputs.product.id}`,
                formData,
            );
            inputs.onSaveSuccess(response.data);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    ///////////
    // Nodes //
    ///////////

    /**
     * Used to create control buttons (color selector and delete button) for each image thumbnail.
     * @param imageId - either existing image ID or "new-image-{nextImageId}" for new images
     * @param colorId - currently selected color ID for the image (if any)
     * @returns Control buttons (color selector and delete button)
     */
    const imageThumbnailControls = (imageId: string, colorId: number | null) => (
        <Box sx={{ width: "fit" }}>
            <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                    value={colorId || ""}
                    onChange={(e) => handleImageColorChange(imageId, e.target.value === "" ? null : Number(e.target.value))}
                    displayEmpty
                >
                    <MenuItem key="" value="">
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
            <IconButton color="error" size="small" onClick={() => handleDeleteImage(imageId, imageId.startsWith("new-image-"))}>
                <DeleteIcon />
            </IconButton>
        </Box>
    );

    const sidebarThumbnails = (
        <Box
            sx={{
                minWidth: 80,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
            }}
        >
            <AnimatePresence>
                {!imageLoading &&
                    existingImageArray.map((img) =>
                        imageThumbnail(
                            `existing-image-${img.imageId}`,
                            existingImageMap[`existing-image-${img.imageId}`],
                            false,
                            <DownloadDone color="success" fontSize="small" />,
                            imageThumbnailControls(String(img.imageId), img.colorId as number | null),
                        ),
                    )}

                {addedByUserImageMap &&
                    Object.entries(addedByUserImageMap).map(([key, file]) =>
                        imageThumbnail(
                            key, // new-image-{id}
                            addedByUserImageFileURLMap ? addedByUserImageFileURLMap[key] : "",
                            true,
                            <Upload color="action" fontSize="small" />,
                            imageThumbnailControls(key, addedByUserImageColorMap[key] || null),
                        ),
                    )}
            </AnimatePresence>

            {/* Button to insert new image */}
            <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFile />}
                sx={{ mt: 2, maxWidth: 300 }} // Limit max width
            >
                {t("page.products.details.addImage")}
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
            </Button>

            {/* Display image upload error */}
            {errors.imageWrongFormat && (
                <Typography color="error" variant="caption">
                    {errors.imageWrongFormat}
                </Typography>
            )}
        </Box>
    );

    return (
        <>
            {/* Loading Spinner */}
            {imageLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress size={40} />
                </Box>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}
            >
                {/* Sidebar Thumbnails */}
                {sidebarThumbnails}

                {/* Main Product Image */}
                {!imageLoading &&
                    selectedImageKey &&
                    inputs.mainImageThumbnail(
                        selectedImageKey.startsWith("new-image-") && addedByUserImageFileURLMap[selectedImageKey]
                            ? addedByUserImageFileURLMap[selectedImageKey]
                            : existingImageMap[selectedImageKey] || "", // Add fallback empty string
                    )}

                {/* Product details/profile */}
                {
                    <ProductPanelInfo
                        editMode={true}
                        product={inputs.product as ProductDto}
                        form={productForm as ProductForm}
                        formErrors={errors}
                        selectedColorId={inputs.selectedColorId as number}
                        isProductImageColorBound={inputs.isProductImageColorBound}
                        allTypes={allTypes}
                        allColors={allColors}
                        allSizes={allSizes}
                        onFormPropsChange={onFormPropsChange}
                        handleColorSelect={inputs.handleColorSelect}
                        handleSaveChanges={handleSaveChanges}
                        onCancelEdit={inputs.onCancelEdit}
                    />
                }
            </Box>
        </>
    );
};

export default ProductAdminView;
