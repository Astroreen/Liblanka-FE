import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Typography,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { ProductTypeDto } from "../../../dto/ProductTypeDto";
import { ProductSizeDto } from "../../../dto/ProductSizeDto";
import { ProductColorDto } from "../../../dto/ProductColorDto";
import { useProtectedAxios } from "../../../hooks/useProtectedAxios";
import { ENDPOINTS } from "../../../api/apiConfig";
import { useTranslation } from "react-i18next";

interface FilterParams {
  name?: string;
  typeId?: number;
  sizeIds?: number[];
  colorIds?: number[];
  minPrice?: number;
  maxPrice?: number;
}

interface ProductFilterProps {
  onFilterChange: (params: FilterParams) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilterChange,
}) => {
  const protectedAxios = useProtectedAxios();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState<ProductTypeDto[]>([]);
  const [sizes, setSizes] = useState<ProductSizeDto[]>([]);
  const [colors, setColors] = useState<ProductColorDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchName, setSearchName] = useState("");
  const [selectedType, setSelectedType] = useState<number | "">("");
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [priceErrorKey, setPriceErrorKey] = useState<string | null>(null);

  // Debounce timer
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  const sidebarWidth = 250;

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await protectedAxios.get(ENDPOINTS.product_info);
        setTypes(response.data.types);
        setSizes(response.data.sizes);
        setColors(response.data.colors);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, [protectedAxios]);

  // Debounced filter update
  useEffect(() => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    let currentErrorKey: string | null = null;

    if ((!isNaN(min) && min < 0) || (!isNaN(max) && max < 0)) {
      currentErrorKey = "page.products.filter.negative_price_error";
    } else if (!isNaN(min) && !isNaN(max) && min > max) {
      currentErrorKey = "page.products.filter.price_error";
    }
    setPriceErrorKey(currentErrorKey);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    if (currentErrorKey) {
      return;
    }

    const timer = setTimeout(() => {
      onFilterChange({
        name: searchName || undefined,
        typeId: selectedType || undefined,
        sizeIds: selectedSizes.length > 0 ? selectedSizes : undefined,
        colorIds: selectedColors.length > 0 ? selectedColors : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      });
    }, 300);

    setSearchTimer(timer);

    return () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
    };
    // eslint-disable-next-line
  }, [
    searchName,
    selectedType,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
  ]);

  const handleSizeSelect = (sizeId: number) => {
    if (!selectedSizes.includes(sizeId)) {
      setSelectedSizes([...selectedSizes, sizeId]);
    }
  };

  const handleColorSelect = (colorId: number) => {
    if (!selectedColors.includes(colorId)) {
      setSelectedColors([...selectedColors, colorId]);
    }
  };

  const handleSizeDelete = (sizeId: number) => {
    setSelectedSizes(selectedSizes.filter((id) => id !== sizeId));
  };

  const handleColorDelete = (colorId: number) => {
    setSelectedColors(selectedColors.filter((id) => id !== colorId));
  };

  return (
    <>
      {/* Bump button always visible at left edge, moves with sidebar */}
      <Box
        sx={{
          position: "fixed",
          left: isOpen ? `${sidebarWidth}px` : 0,
          top: "50%",
          zIndex: 1301,
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <IconButton
          onClick={() => setIsOpen((prev) => !prev)}
          sx={{
            background: "white",
            borderRadius: "0 24px 24px 0",
            boxShadow: "2px 1px 2px 0px",
            border: "1px 1px 1px 1px",
            borderColor: 'grey.300',
            width: 48,
            height: 48,
          }}
        >
          {isOpen ? <CloseIcon /> : <FilterListIcon />}
        </IconButton>
      </Box>

      {/* Custom slide-in sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : `-${sidebarWidth}px`,
          width: `${sidebarWidth}px`,
          height: "100vh",
          bgcolor: "background.paper",
          boxShadow: 6,
          zIndex: 1300,
          p: 2,
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {t("page.products.filter.title")}
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              fullWidth
              label={t("page.products.filter.searchByName")}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{t("page.products.filter.productType")}</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as number)}
                label={t("page.products.filter.productType")}
              >
                <MenuItem value="">
                  <em>{t("page.products.filter.none")}</em>
                </MenuItem>
                {types.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label={t("page.products.filter.minPrice")}
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    sx={{ flex: 1 }}
                    error={!!priceErrorKey}
                  />
                  <TextField
                    label={t("page.products.filter.maxPrice")}
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    sx={{ flex: 1 }}
                    error={!!priceErrorKey}
                  />
                </Box>
                {priceErrorKey && (
                  <FormHelperText error>{t(priceErrorKey)}</FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t("page.products.filter.sizes")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                {selectedSizes.map((sizeId) => {
                  const size = sizes.find((s) => s.id === sizeId);
                  return (
                    <Chip
                      key={sizeId}
                      label={size?.name}
                      onDelete={() => handleSizeDelete(sizeId)}
                    />
                  );
                })}
              </Box>
              <FormControl fullWidth>
                <Select
                  value=""
                  onChange={(e) => handleSizeSelect(Number(e.target.value))}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    {t("page.products.filter.selectSize")}
                  </MenuItem>
                  {sizes
                    .filter((size: ProductSizeDto) => size.id !== undefined && !selectedSizes.includes(size.id))
                    .map((size: ProductSizeDto) => (
                      <MenuItem key={size.id} value={size.id}>
                        {size.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t("page.products.filter.colors")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                {selectedColors.map((colorId) => {
                  const color = colors.find((c) => c.id === colorId);
                  return (
                    <Chip
                      key={colorId}
                      label={color?.name}
                      onDelete={() => handleColorDelete(colorId)}
                      sx={{
                        "&::before": {
                          content: '""',
                          display: "inline-block",
                          width: "16px",
                          height: "16px",
                          marginLeft: "5px",
                          borderRadius: "50%",
                          backgroundColor: color?.hex ?? "#000000",
                          marginRight: "5px",
                        },
                      }}
                    />
                  );
                })}
              </Box>
              <FormControl fullWidth>
                <Select
                  value=""
                  onChange={(e) => handleColorSelect(Number(e.target.value))}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    {t("page.products.filter.selectColor")}
                  </MenuItem>
                  {colors
                    .filter((color: ProductColorDto) => color.id !== undefined && !selectedColors.includes(color.id))
                    .map((color: ProductColorDto) => (
                      <MenuItem key={color.id} value={color.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              backgroundColor: color.hex,
                            }}
                          />
                          {color.name}
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchName("");
                setSelectedType("");
                setSelectedSizes([]);
                setSelectedColors([]);
                setMinPrice("");
                setMaxPrice("");
              }}
              sx={{ mt: 2 }}
            >
              {t("page.products.filter.clearAll")}
            </Button>
          </>
        )}
      </Box>
    </>
  );
};
