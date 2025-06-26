import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useProtectedAxios } from "../../../hooks/useProtectedAxios";
import { Box, Typography, Button, TextField, CircularProgress, Paper, IconButton, Chip, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ProductDto } from "../../../dto/ProductDto";
import { ProductVariantDto } from "../../../dto/ProductVariantDto";
import { ProductConstructionInfoDto } from "../../../dto/ProductConstructionInfoDto";
import { ProductTypeDto } from "../../../dto/ProductTypeDto";
import { UserRole } from "../../../dto/UserRole";
import LanguageSwitcher from "../../../components/languageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { ProductColorDto } from "../../../dto/ProductColorDto";
import { ProductSizeDto } from "../../../dto/ProductSizeDto";
import { BASE_URL, ENDPOINTS } from "../../../api/apiConfig";

interface FormErrors {
  name: boolean;
  price: boolean;
  type: boolean;
  variants: boolean;
}

const validateForm = (form: ProductDto): FormErrors => ({
  name: !form.name || form.name.trim() === "",
  price: isNaN(Number(form.price)) || Number(form.price) <= 0,
  type: !form.typeId,
  variants: !form.variants || form.variants.some((v: ProductVariantDto) => !v.colorId || !v.sizeId || v.quantity == null || v.quantity <= 0),
});

const isFormValid = (errors: FormErrors) => !Object.values(errors).some(Boolean);

function getAllImagesForEdit(form: ProductDto | null) {
  // Unbound images
  const images = form?.imageData ? [...form.imageData] : [];
  // Images bound to colors
  if (form?.imagesByColor) {
    Object.values(form.imagesByColor).forEach(arr => {
      if (Array.isArray(arr)) images.push(...arr);
    });
  }
  return images;
}

// Utility to get a unique key for each image
const getImageKey = (img: any, idx: number, isNew: boolean = false) => {
  if (img && img?.id) return `id-${img?.id}`;
  if (isNew && img && img.name) return `new-${img.name}`;
  return `existing-${idx}`;
};

const ProductDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const axios = useProtectedAxios();
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductDto | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: false, price: false, type: false, variants: false });
  const [allTypes, setAllTypes] = useState<ProductTypeDto[]>([]);
  const [allColors, setAllColors] = useState<ProductColorDto[]>([]);
  const [allSizes, setAllSizes] = useState<ProductSizeDto[]>([]);
  const [newAttribute, setNewAttribute] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]); // For new uploads
  const [imageError, setImageError] = useState<string>("");
  const [imageBindings, setImageBindings] = useState<{ [key: string]: number | null }>({});

  // Fetch product and types
  useEffect(() => {
    setLoading(true);
    const requests: Promise<any>[] = [
      axios.get<ProductDto>(BASE_URL + ENDPOINTS.products + `/${id}`)
    ];
    const isAdmin = isAuthenticated() && user?.role === UserRole.ADMIN;
    if (isAdmin) {
      requests.push(axios.get<ProductConstructionInfoDto>(BASE_URL + ENDPOINTS.product_info));
    }
    Promise.all(requests)
      .then((responses) => {
        const prodRes: {data: ProductDto} = responses[0];
        setProduct(prodRes.data);
        setForm(prodRes.data);
        if (isAdmin && responses[1]) {
          const infoRes: {data: ProductConstructionInfoDto} = responses[1];
          setAllTypes(infoRes.data.types || []);
          setAllColors(infoRes.data.colors || []);
          setAllSizes(infoRes.data.sizes || []);
        }
        setImageBindings({});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, axios, isAuthenticated, user]);

  useEffect(() => {
    if (form) setFormErrors(validateForm(form));
  }, [form]);

  // Images logic: filter by color if needed
  const isColorBound = product?.imagesByColor && Object.keys(product.imagesByColor).length > 0;
  // In edit mode, always show all images (from form.imageData) in the sidebar
  const allImages = editMode
    ? [
        ...(form?.imageData?.map((img, idx) => ({ img, key: getImageKey(img, idx) })) || []),
        ...(form?.imagesByColor
          ? Object.entries(form.imagesByColor).flatMap(([colorId, arr]) =>
              (arr || []).map((img, idx) => ({ img, key: `color-${colorId}-${idx}` }))
            )
          : []),
      ]
    : (isColorBound && selectedColorId && product?.imagesByColor
        ? (product.imagesByColor[selectedColorId] || []).map((img, idx) => ({ img, key: `color-${selectedColorId}-${idx}` }))
        : (product?.imageData || []).map((img, idx) => ({ img, key: getImageKey(img, idx) })));

  // Variants logic: filter by color if needed
  const variants = selectedColorId && product?.variantsByColor
    ? product.variantsByColor[selectedColorId] || []
    : product?.variants || [];

  // Quantity for selected color+size
  const selectedVariant = variants?.find(v => v.sizeId === selectedSizeId);

  // Color click disables if not color-bound
  const handleColorSelect = (colorId: number) => {
    if (!isColorBound) return;
    setSelectedColorId(colorId);
    setMainImageIdx(0);
    setSelectedSizeId(null);
  };

  // Size select
  const handleSizeSelect = (sizeId: number) => {
    setSelectedSizeId(sizeId);
  };

  // Attribute chips
  const handleAddAttribute = () => {
    if (newAttribute.trim() && form) {
      setForm({ ...form, attributes: [...(form.attributes || []), newAttribute.trim()] });
      setNewAttribute("");
    }
  };
  const handleDeleteAttribute = (attr: string) => {
    if (form) setForm({ ...form, attributes: (form.attributes || []).filter(a => a !== attr) });
  };

  // Variant editing (reuse logic from ProductCreation)
  const handleVariantChange = (index: number, field: keyof ProductVariantDto, value: any) => {
    if (!form) return;
    const newVariants = [...(form.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setForm({ ...form, variants: newVariants });
  };
  const addVariant = () => {
    if (!form) return;
    setForm({ ...form, variants: [...(form.variants || []), { colorId: 0, sizeId: 0, quantity: 0 }] });
  };
  const removeVariant = (index: number) => {
    if (!form) return;
    setForm({ ...form, variants: (form.variants || []).filter((_, i) => i !== index) });
  };

  // Image upload/delete/rebind
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const supported = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (supported.length !== files.length) {
      setImageError(t("page.products.details.imageFormatError"));
      return;
    }
    setImageError("");
    setImageFiles(prev => [...prev, ...supported]);
  };
  const handleDeleteImage = (imageKey: string, isNew: boolean = false) => {
    if (!form) return;
    if (isNew) {
      setImageFiles(prevFiles => prevFiles.filter((file, idx) => getImageKey(file, idx, true) !== imageKey));
    } else {
      // Remove from imageData or imagesByColor
      let found = false;
      if (form.imageData) {
        const imgs = [...form.imageData];
        const idx = imgs.findIndex((img, i) => getImageKey(img, i) === imageKey);
        if (idx !== -1) {
          imgs.splice(idx, 1);
          setForm({ ...form, imageData: imgs });
          found = true;
        }
      }
      if (!found && form.imagesByColor) {
        for (const colorId in form.imagesByColor) {
          const arr = form.imagesByColor[colorId] || [];
          const idx = arr.findIndex((img, i) => `color-${colorId}-${i}` === imageKey);
          if (idx !== -1) {
            const newArr = [...arr];
            newArr.splice(idx, 1);
            setForm({ ...form, imagesByColor: { ...form.imagesByColor, [colorId]: newArr } });
            break;
          }
        }
      }
    }
    setImageBindings(prev => {
      const newBindings = { ...prev };
      delete newBindings[imageKey];
      return newBindings;
    });
  };
  const handleImageColorChange = (imageKey: string, colorId: number | null) => {
    setImageBindings(prev => ({ ...prev, [imageKey]: colorId }));
  };

  // Type change
  const handleTypeChange = (typeId: number) => {
    if (!form) return;
    setForm({ ...form, typeId });
  };

  // Save/cancel
  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm(product);
    setImageFiles([]);
    setImageError("");
  };
  const handleChange = (field: keyof ProductDto, value: any) => setForm(f => f ? { ...f, [field]: value } : f);
  const handleSave = async () => {
    if (!form || !isFormValid(formErrors)) return;
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('typeId', String(form.typeId));
    formData.append('description', form.description || '');
    formData.append('price', String(form.price));
    formData.append('attributes', JSON.stringify(form.attributes || []));
    formData.append('variants', JSON.stringify(form.variants || []));
    // Existing image bindings
    formData.append('existingImageBindings', JSON.stringify(imageBindings));

    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('newImages', file);
      });
      // Collect color IDs for new images
      const newImageColorIdsArr = imageFiles.map((file, idx) =>
        imageBindings[getImageKey(file, idx, true)] ?? null
      );
      formData.append('newImageColorIds', JSON.stringify(newImageColorIdsArr));
    }

    const response = await axios.put(BASE_URL + ENDPOINTS.products + `/${id}`, formData);
    setEditMode(false);
    setProduct(response.data);
    setForm(response.data);
    setImageFiles([]);
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm(t("page.products.details.confirmDelete"))) return;
    await axios.delete(BASE_URL + ENDPOINTS.products + `/${id}`);
    navigate('/products');
  };

  // Select first color by default if color bound
  useEffect(() => {
    if (product && product.imagesByColor && Object.keys(product.imagesByColor).length > 0) {
      let firstColorId: number | null = null;
      if (product.colors && product.colors.length > 0) {
        firstColorId = typeof product.colors[0].id === 'number' ? product.colors[0].id : null;
      }
      setSelectedColorId(firstColorId);
      setMainImageIdx(0);
    }
  }, [product]);

  // Select first size by default if available
  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      let ids: number[] = product.sizes?.filter(size => {
        // Only show sizes that have a variant for the selected color and quantity > 0
        if (!selectedColorId || !product.variantsByColor) return true;
        const variants = product.variantsByColor[selectedColorId] || [];
        return variants.some(v => v.sizeId === size.id && v.quantity > 0);
      }).map(color => Number(color?.id));

      setSelectedSizeId(ids[0] ?? null);
    }
  }, [product, selectedColorId]);

  // Add description label above description
  const mainImageSrc = allImages[mainImageIdx] ? `data:image/webp;base64,${allImages[mainImageIdx].img}` : undefined;

  // For new uploads in edit mode
  const newImageObjs = imageFiles.map((file, idx) => ({ file, key: getImageKey(file, idx, true) }));

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (!product || !form) return <Typography align="center">{t("page.products.details.notFound")}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      {/* Top bar: Back arrow and LanguageSwitcher */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/products')}><ArrowBackIosNewIcon /></IconButton>
        <LanguageSwitcher />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Sidebar Thumbnails */}
        <Box sx={{ minWidth: 80, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnimatePresence initial={false}>
            {allImages.map(({ img, key }, idx) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <motion.img
                  src={`data:image/webp;base64,${img}`}
                  alt={t("page.products.details.thumbnailAlt")}
                  onClick={() => setMainImageIdx(idx)}
                  style={{ cursor: 'pointer', borderRadius: 8, border: idx === mainImageIdx ? '2px solid #8d6e63' : '2px solid transparent', width: 60, height: 60, objectFit: 'cover' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                />
                {editMode && (
                  <>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <Select
                        value={imageBindings[key] ?? ''}
                        onChange={e => handleImageColorChange(key, e.target.value === '' ? null : Number(e.target.value))}
                        displayEmpty
                        sx={isColorBound && (imageBindings[key] == null) ? { border: '1px solid red' } : {}}
                      >
                        <MenuItem value="">{t("page.products.details.colors")}</MenuItem>
                        {allColors?.map(color => (
                          <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton color="error" size="small" onClick={() => handleDeleteImage(key)}><DeleteIcon /></IconButton>
                  </>
                )}
              </Box>
            ))}
          </AnimatePresence>
          {/* New uploads */}
          {editMode && newImageObjs.map(({ file, key }, idx) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography variant="caption">{file.name}</Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={imageBindings[key] ?? ''}
                  onChange={e => handleImageColorChange(key, e.target.value === '' ? null : Number(e.target.value))}
                  displayEmpty
                >
                  <MenuItem value="">{t("page.products.details.colors")}</MenuItem>
                  {allColors?.map(color => (
                    <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton color="error" size="small" onClick={() => handleDeleteImage(key, true)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          {editMode && (
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 2 }}>
              {t("page.products.details.addImage")}
              <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
            </Button>
          )}
          {imageError && <Typography color="error">{imageError}</Typography>}
        </Box>
        {/* Main Image */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {mainImageSrc && (
              <motion.img
                key={mainImageIdx}
                src={mainImageSrc}
                alt={t("page.products.details.mainImageAlt")}
                style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </Box>
        {/* Info Panel */}
        <Paper elevation={3} sx={{ flex: 1, p: 4, borderRadius: 4, minWidth: 350 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {editMode ? (
              <TextField
                label={t("page.products.details.name")}
                value={form.name || ''}
                onChange={e => handleChange('name', e.target.value)}
                fullWidth
                variant="standard"
                error={formErrors.name}
                helperText={formErrors.name ? t("page.products.details.nameRequired") : ''}
              />
            ) : (
              <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
            )}
            {isAuthenticated() && user?.role === UserRole.ADMIN && !editMode && (
              <>
                <IconButton onClick={handleEdit}><EditIcon /></IconButton>
                <IconButton color="error" onClick={handleDeleteProduct}><DeleteIcon /></IconButton>
              </>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">{t("page.products.details.descriptionLabel")}</Typography>
            {editMode ? (
              <TextField
                label={t("page.products.details.description")}
                value={form.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                fullWidth
                multiline
                minRows={3}
                variant="standard"
              />
            ) : (
              <Typography variant="body1">{product.description}</Typography>
            )}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="h6">{t("page.products.details.price")}</Typography>
            {editMode ? (
              <TextField
                type="number"
                value={form.price || ''}
                onChange={e => handleChange('price', Number(e.target.value))}
                variant="standard"
                sx={{ width: 100 }}
                error={formErrors.price}
                helperText={formErrors.price ? t("page.products.details.priceRequired") : ''}
              />
            ) : (
              <Typography variant="h6" color="primary">{product.price}&euro;</Typography>
            )}
          </Box>
          {/* Type */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1">{t("page.products.details.type")}: </Typography>
            {editMode ? (
              <FormControl fullWidth>
                <InputLabel>{t("page.products.details.type")}</InputLabel>
                <Select
                  value={form.typeId}
                  label={t("page.products.details.type")}
                  onChange={e => handleTypeChange(Number(e.target.value))}
                >
                  {allTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography>{product.type?.name || '-'}</Typography>
            )}
          </Box>
          {/* Attributes as chips */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">{t("page.products.details.attributes")}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {form.attributes?.map((attr, idx) => (
                <Chip key={idx} label={attr} onDelete={editMode ? () => handleDeleteAttribute(attr) : undefined} color="primary" />
              ))}
              {editMode && (
                <TextField
                  value={newAttribute}
                  onChange={e => setNewAttribute(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddAttribute(); }}
                  placeholder={t("page.products.details.addAttribute")}
                  size="small"
                  sx={{ minWidth: 120 }}
                />
              )}
              {/* {editMode && (
                <Button onClick={handleAddAttribute} startIcon={<AddIcon />} size="small">
                  {t("page.products.details.add")}
                </Button>
              )} */}
            </Box>
          </Box>
          {/* Colors */}
          {!editMode && 
            (<Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="subtitle1">{t("page.products.details.colors")}</Typography>
                {product?.colors?.map(color => (
                <Button
                    key={color.id}
                    onClick={() => handleColorSelect(color.id!)}
                    sx={{ minWidth: 32, height: 32, borderRadius: '50%', background: color.hex, border: selectedColorId === color.id ? '2px solid #333' : '2px solid #eee', p: 0 }}
                    disabled={!isColorBound}
                    title={color.name}
                    aria-label={color.name}
                />
                ))}
            </Box>)
          }
          {/* Sizes as chips, show quantity when selected */}
          { !editMode && 
            (<Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="subtitle1">{t("page.products.details.sizes")}</Typography>
                {product?.sizes
                  ?.filter(size => {
                    // Only show sizes that have a variant for the selected color and quantity > 0
                    if (!selectedColorId || !product.variantsByColor) return true;
                    const variants = product.variantsByColor[selectedColorId] || [];
                    return variants.some(v => v.sizeId === size.id && v.quantity > 0);
                  })
                  .map(size => (
                    <Chip
                      key={size.id}
                      label={size.name}
                      color={selectedSizeId === size.id ? "primary" : "default"}
                      onClick={() => handleSizeSelect(size.id!)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
            </Box>)
          }
          {selectedVariant && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1">{t("page.products.details.quantity")}: {selectedVariant.quantity}</Typography>
            </Box>
          )}
          {/* Variants table for admin */}
          {editMode && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1">{t("page.products.details.variants")}</Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("page.products.details.color")}</TableCell>
                      <TableCell>{t("page.products.details.size")}</TableCell>
                      <TableCell>{t("page.products.details.quantity")}</TableCell>
                      <TableCell>{t("page.products.details.delete")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {form.variants?.map((variant, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={variant.colorId}
                            onChange={e => handleVariantChange(index, "colorId", Number(e.target.value))}
                            size="small"
                          >
                            {allColors?.map((color) => (
                              <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={variant.sizeId}
                            onChange={e => handleVariantChange(index, "sizeId", Number(e.target.value))}
                            size="small"
                          >
                            {allSizes?.map((size) => (
                              <MenuItem key={size.id} value={size.id}>{size.name}</MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={variant.quantity}
                            onChange={e => handleVariantChange(index, "quantity", Number(e.target.value))}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => removeVariant(index)} size="small"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button startIcon={<AddIcon />} onClick={addVariant} sx={{ mt: 1 }}>{t("page.products.details.addVariant")}</Button>
            </Box>
          )}
          {/* Edit Mode Controls */}
          {editMode && (
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={handleCancel}>{t("page.products.details.cancel")}</Button>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} disabled={!isFormValid(formErrors)}>{t("page.products.details.send")}</Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ProductDetails; 