import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { ENDPOINTS } from "../../../../api/apiConfig";
import { useProtectedAxios } from "../../../../hooks/useProtectedAxios";
import { ProductColorDto } from "../../../../dto/ProductColorDto";
import { ProductTypeDto } from "../../../../dto/ProductTypeDto";
import { ProductSizeDto } from "../../../../dto/ProductSizeDto";
import { ProductConstructionInfoDto } from "../../../../dto/ProductConstructionInfoDto";
import { useTranslation } from "react-i18next";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface ProductCreationProps {
  onCancel: () => void;
}

interface ProductVariant {
  colorId: number | "";
  sizeId: number | "";
  quantity: number;
}

interface ColorImages {
  [color: string]: File[];
}

// Supported image MIME types for webp conversion
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
];

// Helper to check if file is a supported image
const isSupportedImageType = (file: File) => SUPPORTED_IMAGE_TYPES.includes(file.type);

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const ProductCreation: React.FC<ProductCreationProps> = ({ onCancel }) => {
  const { t } = useTranslation();
  const protectedAxios = useProtectedAxios();
  const [productInfo, setProductInfo] =
    useState<ProductConstructionInfoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [variants, setVariants] = useState<ProductVariant[]>([
    { colorId: "", sizeId: "", quantity: 0 },
  ]);
  const [attributes, setAttributes] = useState<string[]>([]);
  const [newAttribute, setNewAttribute] = useState("");
  const [colorImages, setColorImages] = useState<ColorImages>({});
  const [useColorSpecificImages, setUseColorSpecificImages] = useState(true);
  const [generalImages, setGeneralImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string>("");

  // Validation state
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    type: false,
    variants: false,
  });

  const [serverError, setServerError] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch product information
  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response: {
          data: ProductConstructionInfoDto;
          status: number;
        } = await protectedAxios.get(ENDPOINTS.product_info);
        if (response.status === 200) {
          setProductInfo(response.data);
          setError("");
        } else {
          setError("Failed to fetch product information");
        }
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch product information");
      } finally {
        setLoading(false);
      }
    };

    fetchProductInfo();
  }, [protectedAxios, error, loading]);

  // Handle variant changes
  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  // Add new variant row
  const addVariant = () => {
    setVariants([...variants, { colorId: "", sizeId: "", quantity: 0 }]);
  };

  // Remove variant row
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Handle attributes
  const handleAddAttribute = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newAttribute.trim()) {
      event.preventDefault();
      setAttributes([...attributes, newAttribute.trim()]);
      setNewAttribute("");
    }
  };

  const handleDeleteAttribute = (attributeToDelete: string) => {
    setAttributes(
      attributes.filter((attribute) => attribute !== attributeToDelete)
    );
  };

  // Handle image upload for color-specific mode
  const handleColorImageUpload = (color: string, files: FileList | null) => {
    if (files) {
      const unsupported = Array.from(files).filter((file) => !isSupportedImageType(file));
      if (unsupported.length > 0) {
        setImageError(
          `Unsupported image format: ${unsupported.map(f => f.name).join(', ')}. Allowed: JPEG, PNG, GIF, BMP, TIFF.`
        );
        return;
      }
      setImageError("");
      setColorImages((prev) => ({
        ...prev,
        [color]: [...(prev[color] || []), ...Array.from(files)],
      }));
    }
  };

  // Handle image upload for general mode
  const handleGeneralImageUpload = (files: FileList | null) => {
    if (files) {
      const unsupported = Array.from(files).filter((file) => !isSupportedImageType(file));
      if (unsupported.length > 0) {
        setImageError(
          `Unsupported image format: ${unsupported.map(f => f.name).join(', ')}. Allowed: JPEG, PNG, GIF, BMP, TIFF.`
        );
        return;
      }
      setImageError("");
      setGeneralImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  // Remove image (both modes)
  const removeImage = (index: number, color?: string) => {
    if (useColorSpecificImages && color) {
      setColorImages((prev) => ({
        ...prev,
        [color]: prev[color].filter((_, i) => i !== index),
      }));
    } else {
      setGeneralImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Prepare images and colorId for submission
  const prepareImageData = () => {
    const images: File[] = [];
    const colorId: (string | null)[] = [];

    if (useColorSpecificImages) {
      Object.entries(colorImages).forEach(([color, files]) => {
        files.forEach((file) => {
          images.push(file);
          colorId.push(color);
        });
      });
    } else {
      generalImages.forEach((file) => {
        images.push(file);
        colorId.push(null);
      });
    }

    return { images, colorId };
  };

  // Helper to check if the form is valid (all required fields filled and valid)
  const isFormValid = () => {
    if (imageError) return false;
    if (name.trim() === "") return false;
    if (isNaN(Number(price)) || Number(price) <= 0) return false;
    if (selectedTypeId === "") return false;
    if (!variants || variants.length === 0) return false;
    for (const v of variants) {
      if (!v.colorId || !v.sizeId || v.quantity <= 0) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid() || imageError) return;

    const { images, colorId } = prepareImageData();

    const productDto = {
        name,
        typeId: selectedTypeId,
        description,
        price: Number(price),
        variants: JSON.stringify(variants),
        attributes: attributes.length > 0 ? JSON.stringify(attributes) : undefined,
    };

    const formData = new FormData();
    // Добавляем простые поля
    Object.entries(productDto).forEach(([key, value]) => {
        if (value !== undefined) {
            formData.append(key, value.toString());
        }
    });

    // Добавляем изображения
    if (images && images.length > 0) {
        images.forEach((image) => {
            formData.append('images', image);
        });
        if (colorId && colorId.length > 0) {
            formData.append('colorIds', JSON.stringify(colorId));
        }
    }
    
    try {
        const response = await protectedAxios.post(ENDPOINTS.products, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 201) {
            console.log('Product created successfully');
            onCancel();
        }
    } catch (error: any) {
        let message = 'Error creating product';
        if (error.response && error.response.data && typeof error.response.data === 'string') {
            message = error.response.data;
        } else if (error.message) {
            message = error.message;
        }
        setServerError(message);
        setOpenSnackbar(true);
    }
};

  if (loading) return <Typography>{t("page.products.creation.loading")}</Typography>;
  if (error)
    return (
      <Typography color="error">
        {t("page.products.creation.error_loading", { error })}
      </Typography>
    );
  if (!productInfo)
    return <Typography>{t("page.products.creation.no_info")}</Typography>;

  return (
    <Box className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="text-gray-800">
          {t("page.products.creation.title")}
        </Typography>
        <Box>
          <Button
            onClick={onCancel}
            className="mr-2"
            variant="outlined"
            color="inherit"
          >
            {t("page.products.creation.cancel")}
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!isFormValid()}>
            {t("page.products.creation.send")}
          </Button>
        </Box>
      </Box>

      {/* Basic Information */}
      <Box className="space-y-4 mb-6">
        <TextField
          fullWidth
          label={t("page.products.creation.form.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          helperText={errors.name ? t("page.products.creation.form.name_required") : ""}
          className="mb-4"
        />

        <TextField
          fullWidth
          label={t("page.products.creation.form.description")}
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4"
        />

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label={t("page.products.creation.form.price")}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
            helperText={errors.price ? t("page.products.creation.form.price_required") : ""}
          />
          <FormControl error={errors.type}>
            <InputLabel>{t("page.products.creation.form.productType")}</InputLabel>
            <Select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value as number)}
              label="Product Type"
            >
              {productInfo.types?.map((type: ProductTypeDto) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.type && (
              <FormHelperText>{t("page.products.creation.form.productType_required")}</FormHelperText>
            )}
          </FormControl>
        </Box>
      </Box>

      {/* Variants Table */}
      <Box className="mb-6">
        <Typography variant="h6" className="mb-2">
          {t("page.products.creation.variants.title")}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("page.products.creation.variants.table.color")}</TableCell>
                <TableCell>{t("page.products.creation.variants.table.size")}</TableCell>
                <TableCell>{t("page.products.creation.variants.table.quantity")}</TableCell>
                <TableCell>{t("page.products.creation.variants.table.delete")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variants?.map((variant, index) => (
                <TableRow key={"row" + index}>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={variant.colorId}
                        onChange={(e) =>
                          handleVariantChange(index, "colorId", e.target.value)
                        }
                        error={errors.variants && !variant.colorId}
                      >
                        {productInfo.colors?.map((color: ProductColorDto, index: number) => (
                          <MenuItem key={"color" + index} value={color.id}>
                            {color.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={variant.sizeId}
                        onChange={(e) =>
                          handleVariantChange(index, "sizeId", e.target.value)
                        }
                        error={errors.variants && !variant.sizeId}
                      >
                        {productInfo.sizes?.map((size: ProductSizeDto, index: number) => (
                          <MenuItem key={"size" + index} value={size.id}>
                            {size.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={variant.quantity}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      error={errors.variants && variant.quantity <= 0}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => removeVariant(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button startIcon={<AddIcon />} onClick={addVariant} className="mt-2">
          {t("page.products.creation.variants.add_variant")}
        </Button>
      </Box>

      {/* Attributes */}
      <Box className="mb-6">
        <Typography variant="h6" className="mb-2">
          {t("page.products.creation.attributes.title")}
        </Typography>
        <TextField
          fullWidth
          label={t("page.products.creation.attributes.new")}
          value={newAttribute}
          onChange={(e) => setNewAttribute(e.target.value)}
          onKeyDown={handleAddAttribute}
          placeholder={t("page.products.creation.attributes.placeholder")}
          size="small"
        />
        <Box className="flex flex-wrap gap-2 mt-2">
          {attributes?.map((attribute, index) => (
            <Chip
              key={"attribute" + index}
              label={attribute}
              onDelete={() => handleDeleteAttribute(attribute)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* Images */}
      <Box className="mb-6">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6">{t("page.products.creation.images.title")}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={useColorSpecificImages}
                onChange={(e) => setUseColorSpecificImages(e.target.checked)}
              />
            }
            label={t("page.products.creation.images.use_color_specific")}
          />
        </Box>

        {useColorSpecificImages ? (
          // Color-specific image upload
          Array.from(new Set(variants?.map(variant => variant.colorId).filter(Boolean)))
            ?.map((color) => (
              <Box key={color} className="mb-4">
                <Typography variant="subtitle1" className="mb-2">
                  {t("page.products.creation.images.imagesForColor", {
                    colorName:
                      productInfo.colors?.find(
                        (c: ProductColorDto) => c.id?.toString() === color?.toString()
                      )?.name || "",
                  })}
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  className="mb-2"
                >
                  {t("page.products.creation.images.add_image")}
                  <VisuallyHiddenInput
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      handleColorImageUpload(color?.toString() ?? "", e.target.files)
                    }
                  />
                </Button>
                <Box className="flex flex-wrap gap-2">
                  {colorImages[color?.toString() ?? ""]?.map((file, index) => (
                    <Chip
                      key={file.name + index}
                      label={file.name}
                      onDelete={() => removeImage(index, color?.toString() ?? "")}
                      className="mb-2"
                    />
                  ))}
                </Box>
              </Box>
            ))
        ) : (
          // General image upload
          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              className="mb-2"
            >
              {t("page.products.creation.images.add_image")}
              <VisuallyHiddenInput
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleGeneralImageUpload(e.target.files)}
              />
            </Button>
            <Box className="flex flex-wrap gap-2">
              {generalImages.map((file, index) => (
                <Chip
                  key={file.name + index}
                  label={file.name}
                  onDelete={() => removeImage(index)}
                  className="mb-2"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {imageError && (
        <Typography color="error" sx={{ mb: 2, fontWeight: 'bold' }}>{imageError}</Typography>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setOpenSnackbar(false)} severity="error">
          {serverError}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ProductCreation;
