import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
    Box,
    Button,
    Chip,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BASE_URL, ENDPOINTS } from "../../../api/apiConfig";
import { useAuthContext } from "../../../contexts/AuthContext";
import { ProductColorDto } from "../../../dto/ProductColorDto";
import { ProductDto } from "../../../dto/ProductDto";
import { ProductSizeDto } from "../../../dto/ProductSizeDto";
import { ProductTypeDto } from "../../../dto/ProductTypeDto";
import { ProductVariantDto } from "../../../dto/ProductVariantDto";
import { ProductForm, ProductFormErrors } from "./ProductAdminView";
import { UserRole } from "../../../dto/UserRole";

export interface ProductPanelInfoProps {
    editMode: boolean;
    product: ProductDto;
    form: ProductForm;
    formErrors: ProductFormErrors;
    selectedColorId: number;
    isProductImageColorBound: boolean;

    allTypes?: ProductTypeDto[];
    allColors?: ProductColorDto[];
    allSizes?: ProductSizeDto[];

    onFormPropsChange: (field: keyof ProductForm, value: any) => void;
    handleColorSelect: (colorId: number) => void;
    handleSaveChanges: () => Promise<void>;
    onCancelEdit?: () => void;
}

const ProductPanelInfo: React.FC<ProductPanelInfoProps> = (inputs) => {
    const {
        product,
        form,
        formErrors,
        allTypes,
        allColors,
        allSizes,
        selectedColorId,
        onFormPropsChange,
    } = inputs;

    const { t } = useTranslation();
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const isAdmin: boolean =
        authContext.isAuthenticated() && authContext.user?.role === UserRole.ADMIN;
    // Variants logic: filter by color if needed
    const variants =
        selectedColorId && product?.variantsByColor
            ? product?.variantsByColor[selectedColorId] || []
            : product?.variants || [];

    ////////////
    // States //
    ////////////

    const [newAttribute, setNewAttribute] = React.useState<string>("");
    const [selectedSizeId, setSelectedSizeId] = React.useState<number | null>(
        null
    );

    const selectedVariant = variants?.find((v) => v.sizeId === selectedSizeId);

    ///////////////
    // Functions //
    ///////////////

    const handleChangeEditView = (editMode: boolean) => {
        if (!editMode && inputs.onCancelEdit) {
            inputs.onCancelEdit();
        }
    };

    const handleSizeSelect = (sizeId: number) => {
        setSelectedSizeId(sizeId);
    };

    const handleDeleteProduct = async () => {
        if (!window.confirm(t("page.products.details.confirmDelete"))) return;
        await axios.delete(BASE_URL + ENDPOINTS.products + `/${product.id}`);
        navigate("/products");
    };

    const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFormPropsChange("name", e.target.value);
    };

    const handleFormDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        onFormPropsChange("description", e.target.value);
    };

    const handleFormPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFormPropsChange("price", Number(e.target.value));
    };

    const handleFormTypeChange = (e: SelectChangeEvent<number>) => {
        onFormPropsChange("typeId", Number(e.target.value));
    };

    const handleFormAddAttribute = (attr: string) => {
        onFormPropsChange("attributes", [...(form.attributes || []), attr]);
    };

    const handleFormDeleteAttribute = (attr: string) => {
        onFormPropsChange(
            "attributes",
            form.attributes.filter((a) => a !== attr)
        );
    };

    const handleFormVariantChange = (
        index: number,
        field: keyof ProductVariantDto,
        value: any
    ) => {
        if (!form) return;
        const newVariants = [...(form.variants || [])];
        newVariants[index] = { ...newVariants[index], [field]: value };
        onFormPropsChange("variants", newVariants);
    };

    const handleFormAddVariant = () => {
        if (!form) return;
        onFormPropsChange("variants", [
            ...(form.variants || []),
            { colorId: 0, sizeId: 0, quantity: 0 },
        ]);
    };

    const handleFormRemoveVariant = (index: number) => {
        if (!form) return;
        onFormPropsChange(
            "variants",
            (form.variants || []).filter((_, i) => i !== index)
        );
    };

    const isFormValid = (errors: ProductFormErrors) => {
        return (
            Object.keys(errors).some(
                (key) => errors[key as keyof ProductFormErrors] !== undefined
            ) === false
        );
    };

    return (
        <Paper
            elevation={3}
            sx={{ flex: 1, p: 4, borderRadius: 4, minWidth: 350 }}
        >
            {/* Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {inputs.editMode ? (
                    <TextField
                        label={t("page.products.details.name")}
                        value={form?.name || ""}
                        onChange={handleFormNameChange}
                        fullWidth
                        variant="standard"
                        error={formErrors.invalidName !== undefined}
                        helperText={formErrors.invalidName ?? ""}
                    />
                ) : (
                    <Typography variant="h4" fontWeight="bold">
                        {product?.name}
                    </Typography>
                )}
                {isAdmin && !inputs.editMode && (
                    <>
                        <IconButton onClick={() => handleChangeEditView(true)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={handleDeleteProduct}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}
            </Box>
            {/* Description */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    {t("page.products.details.descriptionLabel")}
                </Typography>
                {inputs.editMode ? (
                    <TextField
                        label={t("page.products.details.description")}
                        value={form?.description || ""}
                        onChange={handleFormDescriptionChange}
                        fullWidth
                        multiline
                        minRows={3}
                        variant="standard"
                    />
                ) : (
                    <Typography variant="body1">
                        {product?.description}
                    </Typography>
                )}
            </Box>
            {/* Price */}
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <Typography variant="h6">
                    {t("page.products.details.price")}
                </Typography>
                {inputs.editMode ? (
                    <TextField
                        type="number"
                        value={form?.price || ""}
                        onChange={handleFormPriceChange}
                        variant="standard"
                        sx={{ width: 100 }}
                        error={formErrors.invalidPrice !== undefined}
                        helperText={formErrors.invalidPrice ?? ""}
                    />
                ) : (
                    <Typography variant="h6" color="primary">
                        {product?.price}&euro;
                    </Typography>
                )}
            </Box>
            {/* Type */}
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Typography variant="subtitle1">
                    {t("page.products.details.type")}:{" "}
                </Typography>
                {inputs.editMode && allTypes ? (
                    <FormControl fullWidth>
                        <InputLabel>
                            {t("page.products.details.type")}
                        </InputLabel>
                        <Select
                            value={form?.typeId}
                            label={t("page.products.details.type")}
                            onChange={handleFormTypeChange}
                        >
                            {allTypes.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <Typography>{product?.type?.name || "-"}</Typography>
                )}
            </Box>
            {/* Attributes as chips */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    {t("page.products.details.attributes")}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                    }}
                >
                    {form?.attributes?.map((attr, idx) => (
                        <Chip
                            key={idx}
                            label={attr}
                            onDelete={
                                inputs.editMode
                                    ? () => handleFormDeleteAttribute(attr)
                                    : undefined
                            }
                            color="primary"
                        />
                    ))}
                    {inputs.editMode && (
                        <TextField
                            value={newAttribute}
                            onChange={(e) => setNewAttribute(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter")
                                    handleFormAddAttribute(newAttribute);
                            }}
                            placeholder={t(
                                "page.products.details.addAttribute"
                            )}
                            size="small"
                            sx={{ minWidth: 120 }}
                        />
                    )}
                </Box>
            </Box>
            {/* Colors */}
            {!inputs.editMode && (
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                    }}
                >
                    <Typography variant="subtitle1">
                        {t("page.products.details.colors")}
                    </Typography>
                    {product?.colors?.map((color) => (
                        <Button
                            key={color.id}
                            onClick={() => inputs.handleColorSelect(color.id!)}
                            sx={{
                                minWidth: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: color.hex,
                                border:
                                    selectedColorId === color.id
                                        ? "2px solid #333"
                                        : "2px solid #eee",
                                p: 0,
                            }}
                            disabled={!inputs.isProductImageColorBound}
                            title={color.name}
                            aria-label={color.name}
                        />
                    ))}
                </Box>
            )}
            {/* Sizes as chips, show quantity when selected */}
            {!inputs.editMode && (
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                    }}
                >
                    <Typography variant="subtitle1">
                        {t("page.products.details.sizes")}
                    </Typography>
                    {product?.sizes
                        ?.filter((size) => {
                            // Only show sizes that have a variant for the selected color and quantity > 0
                            if (!selectedColorId || !product.variantsByColor)
                                return true;
                            const variants =
                                product.variantsByColor[selectedColorId] || [];
                            return variants.some(
                                (v) => v.sizeId === size.id && v.quantity > 0
                            );
                        })
                        .map((size) => (
                            <Chip
                                key={size.id}
                                label={size.name}
                                color={
                                    selectedSizeId === size.id
                                        ? "primary"
                                        : "default"
                                }
                                onClick={() => handleSizeSelect(size.id!)}
                                sx={{ cursor: "pointer" }}
                            />
                        ))}
                </Box>
            )}
            {selectedVariant && (
                <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle1">
                        {t("page.products.details.quantity")}:{" "}
                        {selectedVariant.quantity}
                    </Typography>
                </Box>
            )}
            {/* Variants table for admin */}
            {inputs.editMode && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1">
                        {t("page.products.details.variants")}
                    </Typography>
                    <TableContainer component={Paper} sx={{ mt: 1 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {t("page.products.details.color")}
                                    </TableCell>
                                    <TableCell>
                                        {t("page.products.details.size")}
                                    </TableCell>
                                    <TableCell>
                                        {t("page.products.details.quantity")}
                                    </TableCell>
                                    <TableCell>
                                        {t("page.products.details.delete")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allColors &&
                                    allSizes &&
                                    form?.variants?.map((variant, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Select
                                                    value={variant.colorId}
                                                    onChange={(e) =>
                                                        handleFormVariantChange(
                                                            index,
                                                            "colorId",
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    size="small"
                                                >
                                                    {allColors?.map((color) => (
                                                        <MenuItem
                                                            key={color.id}
                                                            value={color.id}
                                                        >
                                                            {color.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={variant.sizeId}
                                                    onChange={(e) =>
                                                        handleFormVariantChange(
                                                            index,
                                                            "sizeId",
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    size="small"
                                                >
                                                    {allSizes?.map((size) => (
                                                        <MenuItem
                                                            key={size.id}
                                                            value={size.id}
                                                        >
                                                            {size.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={variant.quantity}
                                                    onChange={(e) =>
                                                        handleFormVariantChange(
                                                            index,
                                                            "quantity",
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() =>
                                                        handleFormRemoveVariant(
                                                            index
                                                        )
                                                    }
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
                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleFormAddVariant}
                        sx={{ mt: 1 }}
                    >
                        {t("page.products.details.addVariant")}
                    </Button>
                </Box>
            )}
            {/* Edit Mode Controls */}
            {inputs.editMode && (
                <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={() => handleChangeEditView(false)}
                    >
                        {t("page.products.details.cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={async () => await inputs.handleSaveChanges()}
                        disabled={!isFormValid(formErrors)}
                    >
                        {t("page.products.details.send")}
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default ProductPanelInfo;
