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

  // Validation state
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    type: false,
    variants: false,
  });

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
      setColorImages((prev) => ({
        ...prev,
        [color]: [...(prev[color] || []), ...Array.from(files)],
      }));
    }
  };

  // Handle image upload for general mode
  const handleGeneralImageUpload = (files: FileList | null) => {
    if (files) {
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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      name: name.trim() === "",
      price: isNaN(Number(price)) || Number(price) <= 0,
      type: selectedTypeId === "",
      variants: variants.some((v) => !v.colorId || !v.sizeId || v.quantity <= 0),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
    } catch (error) {
        console.error('Error creating product:', error);
    }
};

  if (loading) return <Typography>Loading product information...</Typography>;
  if (error)
    return (
      <Typography color="error">
        Error loading product information: {error}
      </Typography>
    );
  if (!productInfo)
    return <Typography>No product information available</Typography>;

  return (
    <Box className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="text-gray-800">
          Create new product
        </Typography>
        <Box>
          <Button
            onClick={onCancel}
            className="mr-2"
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Send
          </Button>
        </Box>
      </Box>

      {/* Basic Information */}
      <Box className="space-y-4 mb-6">
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          helperText={errors.name ? "Name is required" : ""}
          className="mb-4"
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4"
        />

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
            helperText={errors.price ? "Valid price is required" : ""}
          />
          <FormControl error={errors.type}>
            <InputLabel>Product Type</InputLabel>
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
              <FormHelperText>Product type is required</FormHelperText>
            )}
          </FormControl>
        </Box>
      </Box>

      {/* Variants Table */}
      <Box className="mb-6">
        <Typography variant="h6" className="mb-2">
          Product Variants
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Color</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Delete</TableCell>
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
          Add Variant
        </Button>
      </Box>

      {/* Attributes */}
      <Box className="mb-6">
        <Typography variant="h6" className="mb-2">
          Attributes
        </Typography>
        <TextField
          fullWidth
          label="Add new attribute"
          value={newAttribute}
          onChange={(e) => setNewAttribute(e.target.value)}
          onKeyDown={handleAddAttribute}
          placeholder="Press Enter to add"
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
          <Typography variant="h6">Images</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={useColorSpecificImages}
                onChange={(e) => setUseColorSpecificImages(e.target.checked)}
              />
            }
            label="Use color-specific images"
          />
        </Box>

        {useColorSpecificImages ? (
          // Color-specific image upload
          Array.from(new Set(variants?.map(variant => variant.colorId).filter(Boolean)))
            ?.map((color) => (
              <Box key={color} className="mb-4">
                <Typography variant="subtitle1" className="mb-2">
                  Images for{" "}
                  {
                    productInfo.colors?.find(
                      (c: ProductColorDto) => c.id?.toString() === color?.toString()
                    )?.name
                  }{" "}
                  color
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  className="mb-2"
                >
                  Add Image
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
              Add Image
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
    </Box>
  );
};

export default ProductCreation;
