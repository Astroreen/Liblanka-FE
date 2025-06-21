import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Paper,
  Collapse,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useProtectedAxios } from "../../../../hooks/useProtectedAxios";
import { ENDPOINTS } from "../../../../api/apiConfig";
import { ProductTypeDto } from "../../../../dto/ProductTypeDto";
import { ProductSizeDto } from "../../../../dto/ProductSizeDto";
import { ProductColorDto } from "../../../../dto/ProductColorDto";
import { ProductConstructionInfoDto } from "../../../../dto/ProductConstructionInfoDto";
import { useTranslation } from "react-i18next";

interface InformationBlockProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  onCreateClick: () => void;
}

const InformationBlock: React.FC<InformationBlockProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  onCreateClick,
}) => {
  const { t } = useTranslation();
  return (
    <Paper className="p-4 mb-4">
      <Box className="flex justify-between items-center mb-4">
        <Box className="flex items-center">
          <IconButton onClick={onToggle} size="small">
            {isOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
          <Typography variant="h6" className="ml-2">
            {title}
          </Typography>
        </Box>
        {isOpen && (
          <Button variant="contained" color="primary" onClick={onCreateClick}>
            {t("common.create")}
          </Button>
        )}
      </Box>
      <Collapse in={isOpen}>{children}</Collapse>
    </Paper>
  );
};

interface ItemBlockProps {
  onDelete: () => void;
  children: React.ReactNode;
}

const ItemBlock: React.FC<ItemBlockProps> = ({ onDelete, children }) => (
  <Paper className="p-3 mb-2 flex justify-between items-center">
    <Box className="flex items-center flex-grow">{children}</Box>
    <IconButton onClick={onDelete} size="small">
      <DeleteIcon />
    </IconButton>
  </Paper>
);

const ProductInformationManager: React.FC = () => {
  const { t } = useTranslation();
  const protectedAxios = useProtectedAxios();
  const [typesOpen, setTypesOpen] = useState(true);
  const [sizesOpen, setSizesOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);

  // States for new items
  const [newType, setNewType] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });

  // States for showing new item forms
  const [showNewType, setShowNewType] = useState(false);
  const [showNewSize, setShowNewSize] = useState(false);
  const [showNewColor, setShowNewColor] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);

  // States for storing data
  const [types, setTypes] = useState<ProductTypeDto[]>([]);
  const [sizes, setSizes] = useState<ProductSizeDto[]>([]);
  const [colors, setColors] = useState<ProductColorDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: ProductConstructionInfoDto = (
          await protectedAxios.get(ENDPOINTS.product_info)
        ).data;
        setTypes(response.types);
        setSizes(response.sizes);
        setColors(response.colors);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [protectedAxios]);

  const handleCreateType = async () => {
    try {
      const response = await protectedAxios.post(
        ENDPOINTS.product_types,
        null,
        {
          params: { name: newType },
        }
      );
      setTypes([...types, response.data]);
      setNewType("");
      setShowNewType(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateSize = async () => {
    try {
      const response = await protectedAxios.post(
        ENDPOINTS.product_sizes,
        null,
        {
          params: { name: newSize },
        }
      );
      setSizes([...sizes, response.data]);
      setNewSize("");
      setShowNewSize(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateColor = async () => {
    try {
      const response = await protectedAxios.post(
        ENDPOINTS.product_colors,
        null,
        {
          params: { name: newColor.name, hex: newColor.hex },
        }
      );
      setColors([...colors, response.data]);
      setNewColor({ name: "", hex: "#000000" });
      setShowNewColor(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteType = async (type: ProductTypeDto) => {
    try {
      await protectedAxios.delete(ENDPOINTS.product_types, { data: type });
      setTypes(types.filter((t) => t.id !== type.id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSize = async (size: ProductSizeDto) => {
    try {
      await protectedAxios.delete(ENDPOINTS.product_sizes, { data: size });
      setSizes(sizes.filter((s) => s.id !== size.id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteColor = async (color: ProductColorDto) => {
    try {
      await protectedAxios.delete(ENDPOINTS.product_colors, { data: color });
      setColors(colors.filter((c) => c.id !== color.id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isValidHexColor = (hex: string) => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  return (
    <Box className="max-w-4xl mx-auto p-4">
      <Typography variant="h4" className="mb-6">
        {t("page.products.information.title")}
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <InformationBlock
        title={t("page.products.information.types.title")}
        isOpen={typesOpen}
        onToggle={() => setTypesOpen(!typesOpen)}
        onCreateClick={() => setShowNewType(true)}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            {showNewType && (
              <Paper className="p-3 mb-2">
                <Box className="flex items-center gap-2">
                  <TextField
                    fullWidth
                    size="small"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    placeholder={t(
                      "page.products.information.types.placeholder"
                    )}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCreateType}
                    disabled={!newType.trim()}
                  >
                    {t("common.send")}
                  </Button>
                </Box>
              </Paper>
            )}
            {types?.map((type: ProductTypeDto) => (
              <ItemBlock key={type.id} onDelete={() => handleDeleteType(type)}>
                <Typography>{type.name}</Typography>
              </ItemBlock>
            ))}
          </Box>
        )}
      </InformationBlock>

      <InformationBlock
        title={t("page.products.information.sizes.title")}
        isOpen={sizesOpen}
        onToggle={() => setSizesOpen(!sizesOpen)}
        onCreateClick={() => setShowNewSize(true)}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            {showNewSize && (
              <Paper className="p-3 mb-2">
                <Box className="flex items-center gap-2">
                  <TextField
                    fullWidth
                    size="small"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder={t(
                      "page.products.information.sizes.placeholder"
                    )}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCreateSize}
                    disabled={!newSize.trim()}
                  >
                    {t("common.send")}
                  </Button>
                </Box>
              </Paper>
            )}
            {sizes?.map((size: ProductSizeDto) => (
              <ItemBlock key={size.id} onDelete={() => handleDeleteSize(size)}>
                <Typography>{size.name}</Typography>
              </ItemBlock>
            ))}
          </Box>
        )}
      </InformationBlock>

      <InformationBlock
        title={t("page.products.information.colors.title")}
        isOpen={colorsOpen}
        onToggle={() => setColorsOpen(!colorsOpen)}
        onCreateClick={() => setShowNewColor(true)}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            {showNewColor && (
              <Paper className="p-3 mb-2">
                <Box className="flex items-center gap-2">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: newColor.hex,
                      border: "1px solid #ddd",
                    }}
                  />
                  <TextField
                    size="small"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    placeholder={t(
                      "page.products.information.colors.namePlaceholder"
                    )}
                  />
                  <TextField
                    size="small"
                    value={newColor.hex}
                    onChange={(e) =>
                      setNewColor({ ...newColor, hex: e.target.value })
                    }
                    placeholder={t(
                      "page.products.information.colors.hexPlaceholder"
                    )}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCreateColor}
                    disabled={
                      !newColor.name.trim() || !isValidHexColor(newColor.hex)
                    }
                  >
                    {t("common.send")}
                  </Button>
                </Box>
              </Paper>
            )}
            {colors?.map((color: ProductColorDto) => (
              <ItemBlock
                key={color.id}
                onDelete={() => handleDeleteColor(color)}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: color.hex,
                    border: "1px solid #ddd",
                    mr: 2,
                  }}
                />
                <Typography>{color.name}</Typography>
                <Typography className="ml-2 text-gray-500">
                  {color.hex}
                </Typography>
              </ItemBlock>
            ))}
          </Box>
        )}
      </InformationBlock>
    </Box>
  );
};

export default ProductInformationManager;
